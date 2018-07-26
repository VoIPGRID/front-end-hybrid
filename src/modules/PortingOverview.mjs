import React, { Component, Fragment } from 'react';
import PortingSummary from './portingOverview/PortingSummary.mjs';
import InboundPortingRequests from './portingOverview/InboundPortingRequests.mjs';
import OutboundPortingRequests from './portingOverview/OutboundPortingRequests.mjs';
import { get } from 'shared/api';

const partnerId = '04e55b29-bbed-436b-b1a1-7d28d128e019';

class PortingRequestsOverview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inbound: {
        loading: true,
        data: []
      },
      outbound: {
        loading: true,
        data: []
      }
    };

    ['inbound', 'outbound'].forEach(type => {
      get(`partners/${partnerId}/porting_requests/${type}`)
        .then(data => {
          this.setState({ [type]: { data, loading: false } });
        })
        .catch(err => {
          this.setState({ [type]: { data: [], loading: false } });
        });
    });
  }

  render() {
    return (
      <Fragment>
        <h1>Request summary</h1>
        <PortingSummary partnerId={partnerId} />
        <hr />
        <h1>Outporting requests</h1>
        <OutboundPortingRequests partnerId={partnerId}/>
        <hr />
        <h1>Inporting requests</h1>
        <InboundPortingRequests partnerId={partnerId}/>
      </Fragment>
    );
  }
}

export default PortingRequestsOverview;
