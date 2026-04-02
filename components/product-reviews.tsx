'use client'

import { Reviews } from '@/components/reviews'
import { ReviewForm } from '@/components/review-form'
import { useAuth } from '@/hooks/use-auth'

interface ProductReviewsProps {
  productId: string
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const { user } = useAuth()

  return (
    <>
      <Reviews productId={productId} />
      {user && <ReviewForm productId={productId} />}
    </>
  )
}