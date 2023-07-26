import { Injectable } from '@angular/core';
import { StockSymbol } from './model/stock-symbol.model';
import { environment } from '../environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';

declare const solace: any;
declare const MySolClient: any;

@Injectable({
  providedIn: 'root'
})
export class LiveStockPriceService {
  count: number;
  public isConnected: boolean;
  private sharedStatus$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  svcStatus$: Observable<boolean> = this.sharedStatus$;
  private subTrackList: Map<string, number> = null;

  private solaceHost = environment.solace.host;
  private solaceVpn = environment.solace.vpn;
  private solaceClientUserName = environment.solace.clientUserName;
  private solaceClientPassword = environment.solace.clientPassword;
  private solaceClientName = 'SolEx-App-' + this.hashCode((new Date()).toString());

  private factoryProps;
  // This actually should be private but I can't have time to encapsulate this well.
  public mySolclient;

  constructor() {
    this.count = 0;
    this.isConnected = false;
  }

  public setClientCredential(vpn: string, clientUserName: string, clientPassword: string) {
    this.solaceVpn = vpn;
    this.solaceClientUserName = clientUserName;
    this.solaceClientPassword = clientPassword;
  }

  connectToSolace() {
    this.count = 0;
    this.subTrackList = new Map<string, number>();
    this.mySolclient = new MySolClient();
    this.mySolclient.initialize();
    this.mySolclient.setClientName(this.solaceClientName);
    this.mySolclient.connect(this.solaceHost, this.solaceVpn, this.solaceClientUserName, this.solaceClientPassword);
    setTimeout(() => this.checkConnectionStatus(), 1500);
  }

  disconnectFromSolace() {
    this.mySolclient.disconnect();
    this.isConnected = this.mySolclient.isConnected;
    this.sharedStatus$.next(false);
    this.subTrackList = null;
  }

  private hashCode(strString: string) {
    if (Array.prototype.reduce) {
      return strString.split('').reduce(function(a, b) { a = ((a << 5) - a) + b.charCodeAt(0); return a&a}, 0);
    }

    let hash = 0;

    if (strString.length === 0) { return hash; }
    for (let i = 0; i < strString.length; i++) {
      const character  = strString.charCodeAt(i);
      hash = (( hash << 5 ) - hash) + character;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }

  private checkConnectionStatus() {
    this.isConnected = this.mySolclient.isConnected;
    this.count = this.count + 1;
    console.log('Counter of trying to connect: ' + this.count);
    if (this.isConnected) {
      console.log('Connected to SolEx backend @ ' + new Date());
      this.sharedStatus$.next(true);
    } else {
      // console.log('Will confirm status of connection 1.5secs later...');
      setTimeout(() => this.checkConnectionStatus(), 500);
    }
  }

  private printSubTrackList () {
    console.log('Current Subscription Track List: ');
    this.subTrackList.forEach((value, key) => {
      console.log(key + ', ' + value);
    });
  }

  public subscribe(strTopic: string) {
    let iSubCount = 0;
    // 先檢查是否已經有人訂閱過了？
    if (this.subTrackList.has(strTopic)) {
      // 把訂閱管理中關於該topic的計數器+1
      iSubCount = this.subTrackList.get(strTopic).valueOf() + 1;
      this.subTrackList.set(strTopic, iSubCount);
    } else {
      // 沒有任何人訂閱過，所以要新增訂閱，並且加入到訂閱管理
      this.mySolclient.subscribe(strTopic);
      this.subTrackList.set(strTopic, iSubCount + 1);
    }
    this.printSubTrackList();
  }

  public unsubscribe(strTopic: string) {
    let iSubCount = 0;
    // 先檢查是否已經有人訂閱過了？
    if (this.subTrackList.has(strTopic)) {
      // 把訂閱管理中關於該topic的計數器-1
      iSubCount = this.subTrackList.get(strTopic).valueOf() - 1;
      // 如果已經沒有任何元件需要這個topic了，就做解訂閱
      if (iSubCount <= 0) {
        this.mySolclient.unsubscribe(strTopic);
        this.subTrackList.delete(strTopic);
      } else {
        this.subTrackList.set(strTopic, iSubCount);
      }
    }
    this.printSubTrackList();
  }
}
