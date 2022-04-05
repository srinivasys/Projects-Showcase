import {Component} from 'react'

import Loader from 'react-loader-spinner'

import './App.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstant = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class App extends Component {
  state = {
    data: [],
    apiStatus: apiStatusConstant.initial,
    category: categoriesList[0].id,
  }

  componentDidMount = () => {
    this.getData()
  }

  apiFailure = () => {
    this.setState({apiStatus: apiStatusConstant.failure})
  }

  getData = async () => {
    this.setState({apiStatus: apiStatusConstant.inProgress})
    const {category} = this.state

    const url = `https://apis.ccbp.in/ps/projects?category=${category}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(url, options)
    const fetchedData = await response.json()
    if (response.ok) {
      const updatedData = fetchedData.projects.map(eachProject => ({
        id: eachProject.id,
        name: eachProject.name,
        imageUrl: eachProject.image_url,
      }))
      this.setState({data: updatedData, apiStatus: apiStatusConstant.success})
    } else {
      this.apiFailure()
    }
  }

  renderSuccessView = () => {
    const {data} = this.state

    return (
      <ul className="projects-list">
        {data.map(eachProject => (
          <li className="projects-item" key={eachProject.id}>
            <img
              src={eachProject.imageUrl}
              alt={eachProject.name}
              className="image"
            />
            <h1 className="heading">{eachProject.name}</h1>
          </li>
        ))}
      </ul>
    )
  }

  onClickRetryBtn = () => {
    this.getData()
  }

  renderFailureView = () => (
    <div className="fail-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="fail-img"
      />
      <h1 className="fail-head">Oops! Something Went Wrong</h1>
      <p className="fail-des">
        We cannot seem to find the page you are looking for.
      </p>
      <button type="button" className="btn" onClick={this.onClickRetryBtn}>
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" width="50" height="50" />
    </div>
  )

  renderProjectStatus = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstant.success:
        return this.renderSuccessView()
      case apiStatusConstant.failure:
        return this.renderFailureView()
      case apiStatusConstant.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  onChangeCategory = event => {
    this.setState({category: event.target.value}, this.getData)
  }

  render() {
    const {category} = this.state

    return (
      <div className="container">
        <nav className="nav-bar">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="logo"
          />
        </nav>
        <div className="select-container">
          <select
            className="select"
            onChange={this.onChangeCategory}
            value={category}
          >
            {categoriesList.map(eachCategory => (
              <option key={eachCategory.id} value={eachCategory.id}>
                {eachCategory.displayText}
              </option>
            ))}
          </select>
          {this.renderProjectStatus()}
        </div>
      </div>
    )
  }
}

export default App
