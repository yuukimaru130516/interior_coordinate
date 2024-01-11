const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ log: [ 'query' ] });

// HTMLのtagを除去する
function removeHtmlTags(input) {
  return input.replace(/<[^>]*>/g, '').slice(0,50);
}


/* GET blogs page. */
router.get('/', async(req, res, next) => {
    const blogs = await prisma.blog.findMany();
    // ブログ記事を加工して出力する
    const formatted_blogs = blogs.map((article, index) => {
  
      // 記事に1から始まる連番を付与する
      const article_index = index + 1
      // 日付をyyyy/mm/ddに変換する
      const formatted_date = article.createdAt.toLocaleDateString('ja-JP')
  
      return {
        index: article_index,
        articleId: article.articleId,
        category: article.category,
        title: article.title,
        status: article.status,
        content: removeHtmlTags(article.content),
        createdAt: formatted_date
      }
    })
    res.render('pages/blog', { formatted_blogs });
  });

/* ブログ詳細ページ (編集や削除が可能)　*/ 
router.get('/:articleId', async (req, res, next) => {
  const articleId = req.params.articleId;
  try {
    const article = await prisma.blog.findUnique({
      where: { articleId: articleId },
    });
    if (!article) {
      return res.status(404).send('Blog not found');
    }

    res.render('pages/article', { article });
  } catch (error) {
    console.error('Error fetching blog details:', error);
    res.status(500).json({ error: 'Error fetching blog details' });
  } 
});
  
  module.exports = router;