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

class HopLearn extends EventEmitter {

  constructor() {
    super()
    this.activeList = []
    this.caleEvolution = {}
    this.LLMlocal = {}
  }

  /**
  * connect to default LLM available
  * @method openOrchestra
  *
  */
  openOrchestra = function (agent) {

  }
  /**
  * connect to local ML's default
  * @method openAgent
  *
  */
  openAgent = async function (agent) {
    // need a dynamtic way to do this, just like system in ECS.
    if (agent.agent === 'cale-evolution') {
      this.learnListeners()
    } else if (agent.agent === 'cale-gpt4all') {
      // get default LLM Model and start
      // match model type TODO get more detail info on setup e.g. gpu cpu
    } else {
      console.log('no agent sorry')
    }
  }

  /**
  * stop to local ML's default
  * @method closeOrchestra
  *
  */
  closeOrchestra = function (agent) {
    // need a dynamtic way to do this, just like system in ECS.
    if (agent.agent === 'cale-evolution') {
      // send message to beebee to ask peer to start agent
      let outFlow = {}
      outFlow.type = 'hop-learn'
      outFlow.action = 'cale-evolution'
      outFlow.task = 'closed'
      outFlow.data = { name: 'cale-evolution', status: 'closed'}
      this.emit('hop-learn', outFlow)
    } else if (agent.agent === 'cale-gpt4all') {
      // blunt need to close model but remain open for other model selection TODO
      // this.LLMlocal.removeAllListeners()
      // this.LLMlocal = {}
      let outFlow = {}
      outFlow.type = 'hop-learn'
      outFlow.action = 'cale-gpt4all'
      outFlow.task = 'closed'
      outFlow.data = { name: 'cale-gpt4all', model: agent.model, status: 'closed'}
      this.emit('hop-learn', outFlow)
    } else {
      console.log('no agent sorry')
    }
  }

  /**
  * coordinate the to right AI
  * @method coordinateAgents
  *
  */
  coordinateAgents = async function (message) {
    // check agent is active
    let activeCheck = false
    for (let agent of this.activeList) {
      if (typeof agent === 'object') {
        activeCheck = true
      }
    }
    if (activeCheck === true) {
      if (message.task === 'cale-evolution') {

      } else if (message.action === 'question') {

      } else if (message.task === 'cale-gpt4all-rag') {

      } else if (message.task === 'llm-timeseries') {

      }
    } else {
      // send message to beebee to ask peer to start agent
      let messageOut = {}
      messageOut.type = 'bbai-reply'
      messageOut.action = 'hop-learn-feedback'
      messageOut.data = { agent: 'not-active', input: message }
      this.emit('hop-learn', messageOut)
    }

  }

  /**
  * listen for message back to BeeBee
  * @method learnListeners
  *
  */
  learnListeners = function () {
  }

  /**
  * listen for message back to BeeBee
  * @method learnListenersLLM
  *
  */
  learnListenersLLM = function () {
  }

}

export default HopLearn