import React from 'react'
import axios from 'axios'


class Constituency extends React.Component {
  constructor() {
    super()
    this.state = {
      candidates: [],
      persons: []
    }
  }

  componentDidMount() {
    const constituencyFormatted = this.props.match.params.id.toLowerCase().split(' ').join('-')
    axios.get(`https://candidates.democracyclub.org.uk/api/next/ballots/parl.${constituencyFormatted}.2019-12-12/`)
      .then(resp => this.setState({ candidates: resp.data.candidacies }, () => this.getCandidate2()))
      .catch(err => console.log(err.response.data.error))

  }

  getCandidate2() {
    const arr = this.state.candidates
    arr.forEach(element => {
      axios.get(element.person.url)
        .then(resp => {
          const oldArray = [...this.state.persons]
          const persons = oldArray.concat(resp.data)
          this.setState({ persons })
        })

    })
  }

  getIndex(elem) {
    const i = elem.findIndex(p => p.value_type === 'party_ppc_page_url') < 0 ? null : elem.findIndex(p => p.value_type === 'party_ppc_page_url')
    return i
  }

  getPartyUrl(elem) {
    let partyUrl
    switch (elem) {
      case 'Labour Party': partyUrl = 'https://labour.org.uk/'; break
      case 'Green Party': partyUrl = 'https://my.greenparty.org.uk/'; break
      default: null
    }
    return partyUrl
  }

  render() {
    if (!this.state.persons.length === 0) {
      return <h1>...Loading</h1>
    }
    return (
      < section className='section' >
        <h1 className='title'>{`Your Constituency: ${this.props.match.params.id}`}</h1>
        <div className='container'>
          <div className="columns is-mobile is-multiline">
            {this.state.persons.map((elem, i) => {
              return (
                <div key={i} className='column is-half-mobile is-one-third-tablet is-one-quarter-desktop'>
                  <div className="card">
                    <div className='card-image'>
                      <figure className='image'>
                        <img src={elem.images[0].image_url} />
                      </figure>
                    </div>
                    <div className='card-content'>
                      <p>{elem.name}</p>
                      <p><a href={this.getPartyUrl(elem.candidacies[(elem.candidacies.length - 1)].party.name)} >{elem.candidacies[(elem.candidacies.length - 1)].party.name}</a></p>
                      {!elem.identifiers[this.getIndex(elem.identifiers)] ? <p></p> : <p>{elem.identifiers[this.getIndex(elem.identifiers)].value}</p>}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section >
    )
  }

}

export default Constituency


