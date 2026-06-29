const DEFAULT_IMAGE =
  'https://i.pinimg.com/1200x/51/c7/92/51c7925c74e29c4bc921f350a6a45afa.jpg';

export function getProductImage(product) {
  if (!product) {
    return DEFAULT_IMAGE;
  }

  return product.image_url || product.secure_url || DEFAULT_IMAGE;
}
