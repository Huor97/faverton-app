export interface ArticleMetadata {
  title: string
  summary: string
  heroImage: string
  publishDate: string
  readTime: string
  category: `renewable-energy` | `water-management` | `sustainable-farming` | `training` | `local-food` | `eco-hosting`
}

export interface ArticleSection {
  type: `hero` | `intro` | `benefits` | `statistics`
  title?: string
  subtitle?: string
  content?: string
  animation?: string
  backgroundImage?: string
  image?: string
  imagePosition?: `left` | `right`
  items?: Array<{
    title: string
    description: string
    icon: string
  }>
  stats?: Array<{
    value: string
    label: string
    description: string
  }>
}

export interface Article {
  id: string
  slug: string
  metadata: ArticleMetadata
  sections: ArticleSection[]
}
