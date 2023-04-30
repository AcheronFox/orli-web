// middleware.ts
import { NextResponse, NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
const middleware = (async (request: NextRequest) => {
  const host = request.headers.get('host')!;
  const wwwRegex = /^www\./;
  // This redirect will only take effect on a production website (on a non-localhost domain)


  if (!(request.headers.get("WWW-Authorization") == process.env.API_SECRET) && !request.nextUrl.pathname.includes("error") && !request.nextUrl.pathname.includes("sockets") || (request.headers.get("origin") && request.headers.get("origin")+'/' !== process.env.DOMAIN_ROOT)) {
    const url = request.nextUrl.clone()
    url.pathname = '/api/error/forbidden-403'
    return NextResponse.redirect(url)
  }
  else if (wwwRegex.test(host) && !request.headers.get('host')!.includes('localhost')) {
    const newHost = host.replace(wwwRegex, '');
    return NextResponse.redirect(`https://${newHost}${request.nextUrl.pathname}`, 301);
  }
  else {
    return NextResponse.next();
  }
});

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/api/:path*',
  runtime: "nodejs",
}

export default middleware
