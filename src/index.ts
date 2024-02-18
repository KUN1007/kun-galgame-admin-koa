import Koa from 'koa'
import env from '@/config/config.dev'
import router from '@/routes/routes'
import koaBody from 'koa-body'
import cors from '@koa/cors'
import serve from 'koa-static'
import mount from 'koa-mount'
import historyApiFallback from 'koa2-connect-history-api-fallback'
import { kungalgameAuthMiddleware } from '@/middleware/authMiddleware'
import { useKUNGalgameTask } from '@/utils/schedule'
import { kungalgameErrorHandler } from '@/error/kunErrorHandler'

useKUNGalgameTask()

const app = new Koa()

app.proxy = true

app.use(
  cors({
    origin: (ctx: Koa.Context) => {
      const origin = ctx.get('Origin')
      if (env.ALLOW_DOMAIN.includes(origin)) {
        return origin
      }
      return ''
    },
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
)

app.use(
  koaBody({
    multipart: true,
    formidable: {
      uploadDir: env.TEMP_FILE_PATH,
      keepExtensions: true,
      maxFieldsSize: 1007 * 1024,
    },
    onError: (err) => {
      console.log('koa-body: err', err)
    },
  })
)

app.use(kungalgameAuthMiddleware())
app.use(historyApiFallback({ whiteList: ['/'] }))

app.use(router())

app.use(mount('/uploads', serve('./uploads')))

app.on('kunError', kungalgameErrorHandler)

app.listen(parseInt(env.APP_PORT), '127.0.0.1', () => {})
