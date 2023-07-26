import {Component, OnInit} from '@angular/core';
import {LiveStockPriceService} from '../../live-stock-price.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {environment} from '../../../environments/environment';


@Component({
    selector: 'app-control-panel',
    templateUrl: './control-panel.component.html',
    styleUrls: ['./control-panel.component.css']
})
export class ControlPanelComponent implements OnInit {
    public btnStartCaption: string;
    public currentMsg: string;
    public currMsgs: string[] = [];

    TOPIC_PREFIX = 'D/TWSE/';
    TXT_CONNECTING = 'Connecting...';
    TXT_CONNECT = 'Connect';
    TXT_DISCONNECTING = 'Stopping...';
    TXT_DISCONNECT = 'Disconnect';
    TXT_REMIND_TO_SELECT = 'Please click on the symbol name to subscribe realtime data';
    TXT_ALERT_TITLE = 'Connection Status';
    TXT_ALERT_CONTENT = 'Connecting to exchange backend, please wait...';
    TXT_ELIDING_TYPE_BANNER = 'Hi, ';

    private ELIDING_TYPE = {
        'level1': 'Eliding Level 1 (VVIP)',
        'level2': 'Eliding Level 2 (VIP)',
        'level3': 'Eliding Level 3 (NORMAL)',
        'level4': 'Eliding Level 4 (SNAPSHOT)'
    };

    constructor(private liveStockPriceSvc: LiveStockPriceService,
                private modalService: NgbModal) {
    }

    ngOnInit() {
        this.btnStartCaption = this.TXT_CONNECT;
        let elidingType = this.getQueryVariable('elidingType').toLowerCase();

        console.log('Current eliding type: ' + elidingType);

        if (elidingType !== 'not_available') {
            const solaceVpn = environment.solace.vpn;
            const solaceClientUserName = 'customer-' + elidingType;
            const solaceClientPassword = 'password';
            console.log('solaceClientUserName: ' + solaceClientUserName);
            console.log('solaceClientPassword: ' + solaceClientPassword);
            this.liveStockPriceSvc.setClientCredential(solaceVpn, solaceClientUserName, solaceClientPassword);
        } else {
            elidingType = 'guest';
        }
        this.TXT_ELIDING_TYPE_BANNER += this.ELIDING_TYPE[elidingType];
    }

    private getQueryVariable(variable) {
        const query = window.location.search.substring(1);
        const vars = query.split('&');
        for (let i = 0; i < vars.length; i++) {
            const pair = vars[i].split('=');
            if (decodeURIComponent(pair[0]) === variable) {
                return decodeURIComponent(pair[1]);
            }
        }
        return 'NOT_AVAILABLE';
    }

    public btnStartClick() {
        if (this.liveStockPriceSvc.isConnected) {
            this.btnStartCaption = this.TXT_DISCONNECTING;
            console.log('Disconnecting to SolEx backend @ ' + new Date());
            this.liveStockPriceSvc.disconnectFromSolace();
            this.btnStartCaption = this.TXT_CONNECT;
        } else {
            console.log('Connecting to SolEx backend @ ' + new Date());
            this.btnStartCaption = this.TXT_CONNECTING;
            this.liveStockPriceSvc.connectToSolace();
            alert(this.TXT_ELIDING_TYPE_BANNER + '\n' + this.TXT_REMIND_TO_SELECT);
            this.btnStartCaption = this.TXT_DISCONNECT;
            this.liveStockPriceSvc.mySolclient.onSubscriptionOk.subscribe(ev => {
                this.currMsgs.push('SubscriptionOk RELATED: ' + ev.sEv.correlationKey);
                // this.currentMsg += '<p>SubscriptionOk RELATED: ' + ev.sEv.correlationKey + '</p>';
            });
            this.liveStockPriceSvc.mySolclient.onDisconnected.subscribe(ev => {
                this.currMsgs.push('Disconnected RELATED: ' + ev.sEv.correlationKey);
                // this.currentMsg += '<p>Disconnected RELATED: ' + ev.sEv.correlationKey + '</p>';
            });
        }
    }

    openSm(content) {
        this.modalService.open(content, {size: 'sm', centered: true});
    }

}
