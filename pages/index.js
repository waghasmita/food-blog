import { createClient } from 'contentful'
import Image from 'next/image'
import Link from "next/link";
import RecipeCard from '../components/RecipeCard'
import { useRouter } from "next/router";

export async function getStaticProps({locale}) { 
  console.log(locale);
  const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  })

  const res = await client.getEntries({ content_type: "recipe" })
  const banner = await client.getEntries({ content_type: "banner" })
  return {
    props: {
      recipes: res.items,
      banners: banner.items,
    }
  }
}

export default function Recipes({ recipes , banners}) {
  console.log(recipes)
  // console.log(banners)
  const { locales } = useRouter();
  return (
    <div className="main">
      <header>
        <div className="langauages">
          {[...locales].sort().map((locale) => (
            <Link key={locale} href="/" locale={locale}>
              {locale}
            </Link>
          ))}
        </div>
      </header>
      {banners.map(banner => 
        <div className="banner-wrapper" key={banner.sys.id}>
          <h1>{banner.fields.title}</h1>
          <Image 
          src={'https:' + banner.fields.image.fields.file.url}
          width={banner.fields.image.fields.file.details.image.width}
          height={banner.fields.image.fields.file.details.image.height}
          fit={"fill"}
        />
        </div>
      )}
      <div className="recipe-list">
        {recipes.map(recipe => (
          <RecipeCard key={recipe.sys.id} recipe={recipe} />
        ))}
      </div>
      <style jsx>{`
        .recipe-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-gap: 20px 60px;
        }
        .banner-wrapper {
          width: 100%;
          margin-bottom: 20px;
        }
      `}</style>
    </div>
    
  )
}