const Promise = require('bluebird')
const path = require('path')
const semver = require(`semver`)
const { isCI } = require(`ci-info`)

exports.onPreBootstrap = ({ reporter }) => {
  const Node8Plus = semver.satisfies(process.version, `>=8`)
  const usingInk = semver.satisfies(process.version, `>=8`) && !isCI

  console.log({
    Node8Plus,
    isCI,
    usingInk,
  })
  reporter.error('test', new Error('test error'))
}

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  return new Promise((resolve, reject) => {
    const blogPost = path.resolve('./src/templates/blog-post.js')
    resolve(
      graphql(
        `
          {
            allContentfulBlogPost {
              edges {
                node {
                  title
                  slug
                }
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          console.log(result.errors)
          reject(result.errors)
        }

        const posts = result.data.allContentfulBlogPost.edges
        posts.forEach((post, index) => {
          createPage({
            path: `/blog/${post.node.slug}/`,
            component: blogPost,
            context: {
              slug: post.node.slug,
            },
          })
        })
      })
    )
  })
}
