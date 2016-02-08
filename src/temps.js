'use strict';
module.exports = (() => {
  const isArray = obj => typeof obj === 'object' && ((Array.isArray && Array.isArray(obj)) || obj.constructor === Array || obj instanceof Array);

  // GLobal State Events: STATE_RESET, STATE_REVERTED

  const states = [];

  const currentState = () => states[states.length - 1];

  const revertState = n => {
    if (states.length > 1)
      states.pop()
    if (typeof n === 'number' && n > 1)
      revertState(n - 1)
    else
      emit('STATE_REVERTED');  
  };

  const resetState = () => {
    states.splice(1);
    emit('STATE_RESET');
  };

  const setInitialState = obj => states[0] = obj;
  const setNewState = obj => states.push(obj);

  const events = {};
  const attachedTemplates = {};

  const on = (evt, cb) => {
    if (!isArray(events[evt]))
      events[evt] = [];
    events[evt].push(cb);
  };
  
  const emit = (evt, ...args) => {
    if (events[evt]) {
      if (evt === "STATE_RESET" || evt === "STATE_REVERTED") {
        events[evt].forEach(cb => cb(currentState(), ...args));
      }
      else {
        const tempState = Object.assign({}, currentState());
        events[evt].forEach(cb => cb(tempState, ...args));
        setNewState(tempState);
      }
    }
    if (attachedTemplates[evt]) {
      attachedTemplates[evt].forEach(e => {
        e.render();
      });
    }
  };


  /*
  */
  function parseTemplateEvents(eventsObj) {
    const templateEvents = [];
    if (typeof eventsObj === "object") {
      Object.keys(eventsObj).forEach(evt => {

        // parse event args
        if (isArray(eventsObj[evt])) {
          if (!eventsObj[evt].length)
            return console.error('empty array for ' + evt + ' event');

          const _evt = eventsObj[evt].shift();

          // convert values to strings
          const _args = eventsObj[evt].length ? ',' + eventsObj[evt].map(e => {
            if (typeof e === 'string')
              return `'${e}'`;
            else if (typeof e === 'object')
              return JSON.stringify(e).replace(/"/g, '&quot;')
            else
              return e;
          }).join(',') : '' ;

          templateEvents.push(
            `on${evt}="(function(){temps.emit('${_evt}'${_args})})()" `
          );
        }
        else if (typeof eventsObj[evt] === 'string') {
          templateEvents.push(
            `on${evt}="(function(){temps.emit('${eventsObj[evt]}')})()" `
          );
        }
        else
          console.error('could not parse value for ' + evt);  
      });
    }
    
    return templateEvents;
  }


  /*
  */
  function injectTemplateEvents(str, templateEvts) {
    const templateEvents = parseTemplateEvents(templateEvts);

    const domEventsStr = templateEvents.join("").trim();
    if (domEventsStr.length) {
      const matches = str.match(/^<\w+(-\w+)?(\s|>)/);
      if (!matches || !matches.length) {
        console.error('no match for ' + str);
        return str;
      }
      const openTag = matches[0];
      const front = openTag.slice(0, -1);
      const lastChar = openTag.slice(-1);
      return str.replace(openTag, front + ' ' + domEventsStr + ' ' + lastChar);
    }
    return str;
  }

  /*
  */
  function template(templateFactory, eventsObj) {
    const strings = {
      current: "",
      temp: ""
    };
    const elements = {
      current: null,
      temp: null
    };

    const stringify = () => {
      return injectTemplateEvents(
        templateFactory(currentState()).trim(), eventsObj
      );
    };

    return {
      render() {
        strings.temp = stringify();

        // if element is unchanged
        if (elements.current && (strings.temp === strings.current)) {
          return elements.current; 
        }

        const tempElement = document.createElement('div');
        tempElement.innerHTML = strings.temp;

        elements.temp = tempElement.firstChild;

        const to_s = strings.temp;
        elements.temp.toString = () => to_s;

        // define current element if not defined
        if (!elements.current)
           elements.current = elements.temp;

        // if elmnt has been rendered before, replace it
        if (elements.current && elements.current.parentNode) {
          elements.current.parentNode.replaceChild(
            elements.temp, elements.current
          )
        }

        // re-assign current values and delete temp values
        strings.current = strings.temp;
        elements.current = elements.temp;
        strings.temp = elements.temp = null;

        return elements.current;
      },
      toString() {
        return stringify();
      },
      attachStateEvent(...evt) {
        evt.forEach(e => {
          if (typeof attachedTemplates[e] === "undefined")
            attachedTemplates[e] = [];
          attachedTemplates[e].push(this);
        });
      }
    };
  }

  template.getState = () => currentState();
  template.resetState = () => resetState();
  template.setInitialState = obj => setInitialState(obj);
  template.stateHistory = () => states.map(x => x);
  template.revertState = n => revertState(n);
  template.on = (evt, cb) => on(evt, cb);
  template.emit = (evt, ...args) => emit(evt, ...args);
  return template;
})();
