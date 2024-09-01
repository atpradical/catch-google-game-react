export class EventEmitter {
    #subscribers: { [event: string]: ((data: any) => void)[] };

    subscribe(event: string, observer: (data: any) => void): () => void;
    emit(event: string, data?: any): void;
    #unsubscribe(event: string, observer: (data: any) => void): void;
}