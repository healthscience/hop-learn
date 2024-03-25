'use strict'
/**
*  
*  conduct local ML
*
* @class HopLearn
* @package    HopLearn
* @copyright  Copyright (c) 2024 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/
import EventEmitter from 'events'
import CaleEvolution from 'cale-evolution'
import CaleGPT4ALL from 'cale-gtp4all'

class HopLearn extends EventEmitter {

  constructor() {
    super()
    this.caleEvolution = {}
    this.LLMlocal = {}
    // this.openOrchestra()
  }

  /**
  * connect to local ML's default
  * @method openOrchestra
  *
  */
  openOrchestra = async function (agent) {
    // need a dynamtic way to do this, just like system in ECS.
    if (agent === 'cale-evolution') {
      this.caleEvolution = new CaleEvolution()
      this.learnListeners()
    } else if (agent === 'cale-gpt4all') {
      this.LLMlocal = new CaleGPT4ALL()
      this.learnListenersLLM()
      await this.LLMlocal.tobeAgents()
    } else {
      console.log('no agent sorry')
    }
  }

  /**
  * coordinate the to right AI
  * @method coordinateAgents
  *
  */
  coordinateAgents = function (message) {
    if (message.task === 'cale-evolution') {
      this.caleEvolution.CALEflow(message)
    } else if (message.task === 'llm') {

    } else if (message.task === 'llm-timeseries') {

    }

  }

  /**
  * listen for message back to BeeBee
  * @method learnListeners
  *
  */
  learnListeners = function () {
    this.caleEvolution.on('cale-evolution', (data) => {
      this.emit('hop-learn', data)
    })
    this.caleEvolution.askCALE()
  }

  /**
  * listen for message back to BeeBee
  * @method learnListeners
  *
  */
  learnListenersLLM = function () {
    this.LLMlocal.on('cale-gpt4all', (data) => {
      this.emit('hop-learn', data)
    })
  }

}

export default HopLearn