const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ log: [ 'query' ] });

/* 管理者トップページ */
router.get('/', async (req, res, next) => {
  const blogs = await prisma.blog.findMany();
  res.render('pages/admin', { blogs });

});

/* 管理者ブログ詳細ページ (編集や削除が可能)　*/ 
router.get('/blog/:articleId', async (req, res, next) => {
    const articleId = req.params.articleId;
    console.log(articleId)
    try {
      const blog = await prisma.blog.findUnique({
        where: { articleId: articleId },
      });
      if (!blog) {
        return res.status(404).send('Blog not found');
      }
  
      res.render('pages/admin-blog', { blog });
    } catch (error) {
      console.error('Error fetching blog details:', error);
      res.status(500).json({ error: 'Error fetching blog details' });
    } 
});

/*　ブログ新規作成ページ */
router.get('/create', function(req, res, next) {
    res.render('pages/blog-create')
  });

/* 新規作成したブログ内容をデータベース上に保存 */
router.post('/create', async (req, res, next) => {
    const articleId = uuidv4();
    const createdAt = new Date();

    const blog = await prisma.blog.create({
      data: {
        articleId: articleId,
        title: req.body.title.slice(0, 255) || '（名称未設定）',
        content: req.body.content,
        createdAt: createdAt
      }
    });
    res.redirect('../admin');
});

module.exports = router;
