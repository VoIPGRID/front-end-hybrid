import React from 'react';
import { get } from 'shared/api';


export default class extends React.Component {
  constructor(args) {
    super(args);

    this.state = ['inbound', 'outbound'].reduce((prev, type) => {
      get(`partners/${this.props.partnerId}/porting_requests/${type}`, { limit: 0 })
        .then(data => {
          this.setState({ [type]: { data, loading: false } });
        })
        .catch(err => {
          this.setState({ [type]: { data: [], loading: false } });
        });

      return Object.assign(prev, { [type]: { data: [], loading: true } });
    }, {});
  }

  render() {
    return <div>iets
      <div>
        <h3>Outporting requests</h3>
      </div>
      <div>
        <h3>Inporting requests</h3>
      </div>
      </div>;
  }
}
