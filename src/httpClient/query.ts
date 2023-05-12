export const postCommentQuery = `
       mutation WriteComment($post_id: ID!, $text: String!, $comment_id: ID) {
        writeComment(post_id: $post_id, text: $text, comment_id: $comment_id) {
          id
          user {
            id
            username
            profile {
              id
              thumbnail
              __typename
            }
            __typename
          }
          text
          replies_count
          __typename
        }
      }
    `;
