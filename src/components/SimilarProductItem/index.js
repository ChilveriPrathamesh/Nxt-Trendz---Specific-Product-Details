import './index.css'

const starIcon = 'https://assets.ccbp.in/frontend/react-js/star-img.png'

const SimilarProductItem = props => {
  const {productItem} = props
  const {title, brand, imageUrl, rating, price} = productItem
  return (
    <li className="similar-item-container">
      <img
        src={imageUrl}
        alt={`similar product ${title}`}
        className="similar-img"
      />
      <h1 className="similar-title">{title}</h1>
      <p className="similar-brand">by {brand}</p>
      <div className="similar-product-details">
        <p className="similar-price">Rs {price}/-</p>
        <div className="similar-rating-container">
          <p className="similar-rating">{rating}</p>
          <img src={starIcon} alt="star" className="star-icon" />
        </div>
      </div>
    </li>
  )
}
export default SimilarProductItem
