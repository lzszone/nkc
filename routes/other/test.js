const Router = require('koa-router');
const testRouter = new Router();
testRouter
  .get('/', async (ctx, next) => {
    console.log(`${ctx.address}: ${JSON.stringify(ctx.request)}`);
    ctx.data.results = [
      {
        rid: 278310,
        toc: new Date(),
        t: '教师辅导的作用——麦肯锡分析72个国家50万学生后的发现',
        c: '究竟什么是教育孩子最有效的方法，是教育界一直以来争论不休的话题。有的人偏好传统的教师指导方法，也就是由老师来提供材料，回答问题。另一些人则提倡探究式学习，也就是由学生来驱动的学习，在探究式学习里，由学生来提问和探索，学生之间彼此合作，形成自己的想法。提倡探究式学习的人也认为，探究式学习是更加深刻、有意义的学习方式。不过，这两种观点都各自引用大量例证，表明自己这方的优势',
        uid: 74185,
        user: {
          username: 'AAA123'
        },
        forum: {
          fid: 37,
          displayName: '电子技术'
        }
      },
      {
        rid: 278310,
        t: '测试1',
        toc: new Date(),
        c: '还有重要的一点： 报告指出，基于探究式学习的教学可以提高学生对科学的兴趣（由教师指导的教学也与学习乐趣呈正相关，虽然影响较小）。探究式学习也有助于让学生相信，学习科学对于未来的事业是有用的。 兴趣往往能让人产生毅力，而毅力往往能带来更好的学习（和生活上的）成绩。',
        uid: 74185,
        user: {
          username: 'AAA123'
        },
        forum: {
          fid: 37,
          displayName: '电子技术'
        }
      },
      {
        rid: 278310,
        t: '测试1',
        toc: new Date(),
        c: '究竟什么是教育孩子最有效的方法，是教育界一直以来争论不休的话题。有的人偏好传统的教师指导方法，也就是由老师来提供材料，回答问题。另一些人则提倡探究式学习，也就是由学生来驱动的学习，在探究式学习里，由学生来提问和探索，学生之间彼此合作，形成自己的想法。提倡探究式学习的人也认为，探究式学习是更加深刻、有意义的学习方式。不过，这两种观点都各自引用大量例证，表明自己这方的优势',
        uid: 74185,
        user: {
          username: 'AAA123'
        },
        forum: {
          fid: 37,
          displayName: '电子技术'
        }
      },
      {
        t: '测试1',
        toc: new Date(),
        c: '究竟什么是教育孩子最有效的方法，是教育界一直以来争论不休的话题。有的人偏好传统的教师指导方法，也就是由老师来提供材料，回答问题。另一些人则提倡探究式学习，也就是由学生来驱动的学习，在探究式学习里，由学生来提问和探索，学生之间彼此合作，形成自己的想法。提倡探究式学习的人也认为，探究式学习是更加深刻、有意义的学习方式。不过，这两种观点都各自引用大量例证，表明自己这方的优势',
        uid: 74185,
        user: {
          username: 'AAA123'
        },
        forum: {
          fid: 37,
          displayName: '电子技术'
        }
      },
      {
        t: '测试1',
        toc: new Date(),
        c: '究竟什么是教育孩子最有效的方法，是教育界一直以来争论不休的话题。有的人偏好传统的教师指导方法，也就是由老师来提供材料，回答问题。另一些人则提倡探究式学习，也就是由学生来驱动的学习，在探究式学习里，由学生来提问和探索，学生之间彼此合作，形成自己的想法。提倡探究式学习的人也认为，探究式学习是更加深刻、有意义的学习方式。不过，这两种观点都各自引用大量例证，表明自己这方的优势',
        uid: 74185,
        user: {
          username: 'AAA123'
        },
        forum: {
          fid: 37,
          displayName: '电子技术'
        }
      },
      {
        t: '测试1',
        toc: new Date(),
        c: '究竟什么是教育孩子最有效的方法，是教育界一直以来争论不休的话题。有的人偏好传统的教师指导方法，也就是由老师来提供材料，回答问题。另一些人则提倡探究式学习，也就是由学生来驱动的学习，在探究式学习里，由学生来提问和探索，学生之间彼此合作，形成自己的想法。提倡探究式学习的人也认为，探究式学习是更加深刻、有意义的学习方式。不过，这两种观点都各自引用大量例证，表明自己这方的优势',
        uid: 74185,
        user: {
          username: 'AAA123'
        },
        forum: {
          fid: 37,
          displayName: '电子技术'
        }
      },
      {
        rid: 278309,
        t: '测试1',
        toc: new Date(),
        c: '究竟什么是教育孩子最有效的方法，是教育界一直以来争论不休的话题。有的人偏好传统的教师指导方法，也就是由老师来提供材料，回答问题。另一些人则提倡探究式学习，也就是由学生来驱动的学习，在探究式学习里，由学生来提问和探索，学生之间彼此合作，形成自己的想法。提倡探究式学习的人也认为，探究式学习是更加深刻、有意义的学习方式。不过，这两种观点都各自引用大量例证，表明自己这方的优势',
        uid: 74185,
        user: {
          username: 'AAA123'
        },
        forum: {
          fid: 37,
          displayName: '电子技术'
        }
      }
    ];
    await next();
  });
module.exports = testRouter;
