export class Timer {

  private baseTime: number;

  constructor(
    private totaltime: number,
    private refreshTime: number,
    private onBasePassed: any,
    private onTimePassed: any,
  ) {
    this.baseTime = this.totaltime - this.refreshTime;
  }

  baseTimeout!: NodeJS.Timeout | null;
  refreshTimeout!: NodeJS.Timeout | null;

  start() {
    console.info(`Starting timer ${this.baseTime}, ${this.refreshTime}`);
    this.baseTimeout = setTimeout(this._onBasePassed.bind(this), this.baseTime)
  }

  private _onBasePassed() {
    console.info('Base passed');
    this.baseTimeout = null;
    this.onBasePassed();
    this.refreshTimeout = setTimeout(this.onTimePassed.bind(this), this.refreshTime);
  }

  stop() {
    console.info('Stopping timer');
    if(this.baseTimeout) clearTimeout(this.baseTimeout);
    if(this.refreshTimeout) clearTimeout(this.refreshTimeout);
  }

  refresh() {
    console.info('Refreshing timer');
    this.stop()
    this.start()
  }
}
