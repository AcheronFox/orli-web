type Props = {
  statusCode: number
}

function Error({ statusCode }: Props) {
  return (
    <div style={{
      margin: "auto",
      width: "50%",
      padding: "3rem",
    }}>
      <h1 style={{ color: "white", paddingBottom: "1rem" }}>
        {statusCode
          ? `An error ${statusCode} occurred on server`
          : 'An error occurred on client'}
      </h1>
    </div>
  )
}

Error.getInitialProps = ({ res, err }: { res: any, err: any }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error