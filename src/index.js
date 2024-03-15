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

class HopLearn extends EventEmitter {

  constructor() {
    super()
    this.openOrchestra()
    this.caleEvolution = {}
  }

  /**
  * connect to local ML's default
  * @method openOrchestra
  *
  */
  openOrchestra = function () {
    console.log('conductor bring ML local to be')
    // need a dynamtic way to do this, just like system in ECS.
    this.caleEvolution = new CaleEvolution()
  }

  /**
  * coordinate the to right AI
  * @method coordinateAI
  *
  */
  coordinateAI = function (task) {
    console.log('where to route message to?')
    console.log(task)
    if (task.type === 'evolution') {

    } else if (task.type === 'llm') {

    } else if (task.type === 'llm-timeseries') {

    }

  }

  /**
  * listen for message back to BeeBee
  * @method learnListeners
  *
  */
  learnListeners = function () {

  }

}

export default HopLearn