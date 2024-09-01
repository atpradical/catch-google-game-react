/**
 * Observer pattern.
 */
export class EventEmitter {
  #subscribers = {
    // {
    //   "click" : [callback1, callback2, callback3],
    //   "keydown" : [callback1, callback2, callback3]
    // }
  }

  /**
   * Метод для подписки на событие (addEventListener | on)
   * @param {string} event - Имя события, на которое происходит подписка.
   * @param {function} observer - Функция-наблюдатель, которая будет вызвана при срабатывании события.
   * @returns {function} Возвращает функцию, которая при вызове отменит подписку.
   */
  subscribe(event, observer) {
    if (!this.#subscribers[event]) {
      this.#subscribers[event] = []
    }
    this.#subscribers[event].push(observer)

    return () => {
      this.#unsubscribe(event, observer)
    }
  }

  /**
   * Метод для вызова функции подписанного на событие (notify | fire).
   * @param {string} event - Название события.
   * @param {*} [data=null] - Данные, которые нужно передать функциям-наблюдателям при вызове.
   */
  emit(event, data = null) {
    if (this.#subscribers[event].length > 0) {
      this.#subscribers[event].forEach(callbackObserver => {
        callbackObserver(data)
      })
    }
  }
  /**
   * Приватный метод для "отписки" подписчика (removeEventListener | findAndRemoveSubscriber | off).
   * @param {string} event - Название события.
   * @param {function} observer - Функция-наблюдатель, которую необходимо удалить.
   */
  #unsubscribe(event, observer) {
    if (this.#subscribers[event].length > 0) {
      this.#subscribers[event] = this.#subscribers[event].filter(cb => cb !== observer)
    }
  }
}
