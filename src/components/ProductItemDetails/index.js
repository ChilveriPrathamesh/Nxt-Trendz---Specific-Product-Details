import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import {BsDashSquare, BsPlusSquare} from 'react-icons/bs'

import Header from '../Header'

import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

class ProductItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    productsItemData: [],
    similarItemData: [],
    quantityCount: 1,
  }
  componentDidMount() {
    this.getProductsItem()
  }

  getProductsItem = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    this.setState({
      apiStatus: apiStatusConstants.loading,
    })

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()

      const updatedData = {
        availability: data.availability,
        brand: data.brand,
        description: data.description,
        id: data.id,
        imageUrl: data.image_url,
        price: data.price,
        rating: data.rating,
        title: data.title,
        totalReviews: data.total_reviews,
        similarProducts: data.similar_products.map(eachItem => ({
          availability: eachItem.availability,
          brand: eachItem.brand,
          description: eachItem.description,
          id: eachItem.id,
          imageUrl: eachItem.image_url,
          price: eachItem.price,
          rating: eachItem.rating,
          title: eachItem.title,
          totalReviews: eachItem.total_reviews,
        })),
      }
      this.setState({
        productsItemData: updatedData,
        similarItemData: updatedData.similarProducts,
        apiStatus: apiStatusConstants.success,
      })
    } else if (response.status === 404) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  quantityIncrement = () => {
    this.setState(prev => ({quantityCount: prev.quantityCount + 1}))
  }

  quantityDecrement = () => {
    const {quantityCount} = this.state
    if (quantityCount > 1) {
      this.setState(prev => ({quantityCount: prev.quantityCount - 1}))
    }
  }

  renderProductsDetails = () => {
    const {productsItemData, similarItemData, quantityCount} = this.state

    const {
      availability,
      imageUrl,
      title,
      brand,
      totalReviews,
      rating,
      price,
      description,
    } = productsItemData

    return (
      <div className="productItem-bg-container">
        <div className="productItem-container">
          <img src={imageUrl} alt="product" className="product-img" />
          <div className="productItem-list-container">
            <h1 className="title">{title}</h1>
            <p className="price">Rs {price}</p>
            <div className="rating-review-container">
              <div className="rating-container">
                <p className="rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star-icon"
                />
              </div>
              <p className="reviews">{totalReviews} Reviews</p>
            </div>
            <p className="description">{description}</p>
            <div className="available-container">
              <p className="available">Available : </p>
              <p className="available-sub">{availability} </p>
            </div>
            <div className="brand-container">
              <p className="brand">Brand :</p>
              <p className="brand-sub">{brand} </p>
            </div>
            <hr />
            <div className="count-icons">
              <button
                type="button"
                className="bs-button"
                onClick={this.quantityDecrement}
                data-testid="minus"
              >
                <BsDashSquare className="bs" />
              </button>

              <p className="count">{quantityCount}</p>
              <button
                type="button"
                className="bs-button"
                onClick={this.quantityIncrement}
                data-testid="plus"
              >
                <BsPlusSquare className="bs" />
              </button>
            </div>
            <button type="button" className="add-button">
              ADD TO CART
            </button>
          </div>
        </div>
        <div className="similar-container">
          <h1 className="similar-heading">Similar Products</h1>
          <ul className="similar-products-list">
            {similarItemData.map(product => (
              <SimilarProductItem productItem={product} key={product.id} />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderLoadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderErrorView = () => (
    <div className="error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="error view"
        className="error-img"
      />
      <h1 className="error-title">Products Not Found</h1>
      <Link to="/products">
        <button className="error-button" type="button">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  renderAllProductsDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductsDetails()
      case apiStatusConstants.failure:
        return this.renderErrorView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()

      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderAllProductsDetails()}
      </>
    )
  }
}
export default ProductItemDetails
