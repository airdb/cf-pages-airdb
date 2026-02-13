/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */


// 定义Env类型
type Env = Record<string, string>;

// 封装通用的JSON响应工具
const createJsonResponse = (
  data: Record<string, any>,
  code: number = 200,
  message: string = 'success'
) => {
  const headers = new Headers();
  headers.set('Content-Type', 'application/json; charset=utf-8');
  headers.set('Access-Control-Allow-Origin', '*');

  return new Response(
    JSON.stringify({ code, message, data }, null, 2),
    { status: code, headers }
  );
};

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // 根据路径分发到对应方法，传递完整的request、env、ctx
    switch (url.pathname) {
      case '/message':
        return this.handleMessage(request, env, ctx);
      case '/random':
        return this.handleRandom(request, env, ctx);
      default:
        return this.handleNotFound(request, env, ctx);
    }
  },

  // 处理/message路径：接收完整的request、env、ctx
  async handleMessage(request: Request, env: Env, ctx: ExecutionContext) {
    // 方法内可独立获取客户端信息（也可复用、可扩展）
    const clientInfo = {
      client_ip: request.headers.get('CF-Connecting-IP') || '未知IP',
      user_agent: request.headers.get('User-Agent') || '未知User-Agent'
    };

    // 可按需使用env（环境变量）、ctx（上下文）
    // 示例：打印环境变量（如果有配置）
    console.log('Env示例:', env.MY_VAR || '无环境变量');
    // 示例：使用ctx绑定异步任务（Cloudflare Workers特性）
    ctx.waitUntil(Promise.resolve('message路径异步任务'));

    return createJsonResponse({
      content: 'Hello, World!',
      ...clientInfo
    });
  },

  // 处理/random路径：接收完整的request、env、ctx
  async handleRandom(request: Request, env: Env, ctx: ExecutionContext) {
    const clientInfo = {
      client_ip: request.headers.get('CF-Connecting-IP') || '未知IP',
      user_agent: request.headers.get('User-Agent') || '未知User-Agent'
    };

    // 示例：使用request获取请求方法、查询参数等
    console.log('请求方法:', request.method);
    console.log('查询参数:', new URL(request.url).searchParams.get('id'));

    return createJsonResponse({
      random_uuid: crypto.randomUUID(),
      ...clientInfo
    });
  },

  // 处理404：接收完整的request、env、ctx
  async handleNotFound(request: Request, env: Env, ctx: ExecutionContext) {
    const clientInfo = {
      client_ip: request.headers.get('CF-Connecting-IP') || '未知IP',
      user_agent: request.headers.get('User-Agent') || '未知User-Agent'
    };

    // 示例：记录404请求的URL到日志
    console.log('404路径:', new URL(request.url).pathname);

    return createJsonResponse(
      {
        not_found_path: new URL(request.url).pathname,
        ...clientInfo
      },
      404,
      'Not Found'
    );
  }
} satisfies ExportedHandler<Env>;
