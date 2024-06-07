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
    this.activeList = []
    this.caleEvolution = {}
    this.LLMlocal = {}
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
  * stop to local ML's default
  * @method closeOrchestra
  *
  */
  closeOrchestra = function (agent) {
    // need a dynamtic way to do this, just like system in ECS.
    if (agent === 'cale-evolution') {
      this.caleEvolution.removeAllListeners()
      this.caleEvolution = {}
      // send message to beebee to ask peer to start agent
      let outFlow = {}
      outFlow.type = 'hop-learn'
      outFlow.action = 'cale-evolution'
      outFlow.task = 'closed'
      outFlow.data = { name: 'cale-evolution', status: 'closed'}
      this.emit('hop-learn', outFlow)
    } else if (agent === 'cale-gpt4all') {
      this.LLMlocal.removeAllListeners()
      this.LLMlocal = {}
      let outFlow = {}
      outFlow.type = 'hop-learn'
      outFlow.action = 'cale-gpt4all'
      outFlow.task = 'closed'
      outFlow.data = { name: 'cale-gpt4all', status: 'closed'}
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
        this.caleEvolution.CALEflow(message)
      } else if (message.action === 'question') {
        await this.LLMlocal.incomingMessage(message)
      } else if (message.task === 'cale-gpt4all-rag') {
        await this.LLMlocal.prepareRAG(message)

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
    this.caleEvolution.on('cale-evolution', (data) => {
      this.activeList.push(data)
      this.emit('hop-learn', data)
    })
    this.caleEvolution.askCALE()
  }

  /**
  * listen for message back to BeeBee
  * @method learnListenersLLM
  *
  */
  learnListenersLLM = function () {
    this.LLMlocal.on('cale-gpt4all', (data) => {
      if (data.task === 'response') {
        this.emit('hop-learn-response', data)
      } else if (data.task === 'embedded') {
        this.emit('hop-learn-embedded', data)
      } else {
        this.emit('hop-learn', data)
        this.activeList.push(data)
      }
    })
  }

}

export default HopLearn