import posts from "../data/posts";

/**
 * TODO Change this file to implement Contentful's GraphQL API.
 */

const POST_QUERY = `
query {
  postCollection(order: date_ASC, limit: 10) {
    items {
      slug
      title
			coverImage {
        url
        width
        height
      }
      date
      author {
        name
        picture {
          url
        }
      }
      excerpt
      content {
        json
        links {
          assets {
            block {
              sys {
                id
              }
              url
              size
              width
              height
              description
            }
          }
          entries {
            block {
              __typename
              sys {
                id
              }

              ... on CodeBlock {
                code
                language
              }

              ... on Details {
                title
                body {
                  json
                }
              }
            }
          }
        }
      }
    }
  }
}
`;

async function fetchGraphQL(query) {
  return fetch(
    `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.CONTENTFUL_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({ query }),
    },
  )
    .then((response) => response.json())
    .catch((error) => console.error(error));
}

export async function getAllPostsWithSlug() {
  const response = await fetchGraphQL(POST_QUERY);
  return response.data.postCollection.items;
}

export async function getAllPostsForHome() {
  const response = await fetchGraphQL(POST_QUERY);
  return response.data.postCollection.items;
}

export async function getPostAndMorePosts(slug) {
  const response = await fetchGraphQL(POST_QUERY);
  const posts = response.data.postCollection.items;

  const currentPost = posts.find((post) => post.slug === slug);
  const currentPostIndex = posts.findIndex((post) => post.slug === slug);
  const prevPost = posts[currentPostIndex - 1] || posts[posts.length - 1];
  const nextPost = posts[currentPostIndex + 1] || posts[0];

  if (!currentPost) {
    return {
      post: false,
    };
  }

  return {
    post: currentPost,
    morePosts: [prevPost, nextPost],
  };
}
