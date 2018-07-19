import React, { Component } from 'react';
// import api from 'shared/api';

const headerItems = {
  company_name: 'Client name',
  status: 'Status',
  date: 'Porting date & time',
  phonenumbers: 'Numbers & count'
};

const headers = Object.entries(headerItems);

const Row = data => <tr key={data.id}>{headers.map(([name]) => <td key={name}>{data[name]}</td>)}</tr>;

class PortingRequestsOverview extends Component {
  constructor(props) {
    super(props);

    // this.api = api();
    // this.service = this.api.partners('0a18b426-f823-4eda-86e4-c9b65b0ace02');
    // console.log(this.service);

    this.state = { loading: true };
    fetch(
      'http://localhost:8888/api/v2/partners/04e55b29-bbed-436b-b1a1-7d28d128e019/porting_requests/inbound',
      {
        mode: 'cors',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json; charset=utf-8', 'X-CSRFToken': 'r' }
      }
    )
      .then(r => r.json())
      .then(data => {
        this.setState({ data, loading: false });
      })
      .catch(err => {
        this.setState({ data: [], loading: false });
      });
  }

  blaat = () => {
    console.log(this);
  };

  render() {
    const { loading } = this.state;
    if (loading) {
      return '...';
    }

    return (
      <table>
        <thead>
          <tr>{headers.map(([name, value]) => <th key={name}>{value}</th>)}</tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td>...</td>
            </tr>
          ) : (
            this.state.data.map(Row)
          )}
        </tbody>
      </table>
    );
  }
}

export default PortingRequestsOverview;
