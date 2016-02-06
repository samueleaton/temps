'use strict';
module.exports = (() => {
  const isArray = obj => typeof obj === 'object' && ((Array.isArray && Array.isArray(obj)) || obj.constructor === Array || obj instanceof Array);

  // GLobal State Events: STATE_RESET, STATE_REVERTED

  const states = [];
  const currentState = () => states[states.length - 1]
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
    console.log('evt: ', evt);
    console.log('attachedTemplates: ', attachedTemplates);
    console.log('attachedTemplates[evt]: ', attachedTemplates[evt]);
    if (attachedTemplates[evt]) {
      attachedTemplates[evt].forEach(e => e.render());
    }
  };


  function template(factory, scripts) {
    const strings = {
      current: "",
      temp: ""
    };
    const elements = {
      current: null,
      temp: null
    };
    const stringify = () => factory(currentState()).trim();

    return {
      render() {
        strings.temp = stringify();

        // if element is unchanged
        if (elements.current && strings.temp === strings.current) {
          return elements.current; 
        }

        // console.log('re-rendering');

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
          // console.log('\n** doing the swap **\n');
          elements.current.parentNode.replaceChild(
            elements.temp, elements.current
          )
        }

        // re-assign current values and delete temp values
        strings.current = strings.temp;
        elements.current = elements.temp;
        strings.temp = elements.temp = null;

        if (typeof scripts == "function")
          scripts(elements.current);

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

  return {
    getState: () => currentState(),
    resetState: () => resetState(),
    setInitialState: obj => setInitialState(obj),
    stateHistory: () => states.map(x => x),
    revertState: n => revertState(n),
    template: (factory, scripts) => template(factory, scripts),
    on: (evt, cb) => on(evt, cb),
    emit: (evt, ...args) => emit(evt, ...args)
  };

})();
