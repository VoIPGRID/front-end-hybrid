import React from 'react';
import { get } from 'shared/api';

const headerItems = {
  company_name: 'Client name',
  status: 'Status',
  _date: 'Porting date & time',
  _phonenumbers: 'Numbers',
  _rangeCount: 'count'
};

const headers = Object.entries(headerItems);

const Row = data => {
  const { first, last } = data.phone_number_ranges[0];

  const derivedData = {
    _date:
      data.actual_porting_date ||
      data.porting_completed_date ||
      data.first_possible_date ||
      data.proposed_date,
    _phonenumbers: `${first} ${last}`,
    _rangeCount: data.phone_number_ranges.length
  };
  return (
    <tr key={data.id}>
      {headers.map(([name]) => <td key={name}>{data[name] || derivedData[name]}</td>)}
    </tr>
  );
};

export default class extends React.Component {
  constructor(args) {
    super(args);

    this.state = {
      loading: true,
      data: []
    };
    this.load();
  }

  load = (pagination = {}) => {
    if (this.props.partnerId) {
      get(`partners/${this.props.partnerId}/porting_requests/outbound`, { pagination })
        .then(data => {
          this.setState({ data, loading: false });
        })
        .catch(err => {
          this.setState({ data: [], loading: false });
        });
    }
  };

  render() {
    const { data, loading } = this.state;

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
            data.map(Row)
          )}
        </tbody>
      </table>
    );
  }
}
