const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ log: [ 'query' ] });

// HTMLのtagを除去する
function removeHtmlTags(input) {
  return input.replace(/<[^>]*>/g, '').slice(0,50);
}

const htmlString = '<p>This is <b>HTML</b> text.</p>';
const textWithoutHtml = removeHtmlTags(htmlString);

/* GET home page. */
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
      id: article.id,
      title: article.title,
      content: removeHtmlTags(article.content),
      createdAt: formatted_date
    }
  })
  res.render('pages/index', { formatted_blogs });
});

module.exports = router;
