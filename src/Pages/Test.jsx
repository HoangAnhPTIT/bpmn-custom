export default function Test() {

  const count = [1, 2, 3, 4]
  return (
    <>
      {
        count.map(x => {
          return (<h1 key={x}>{x}</h1>)
        })
      }
    </>
  )
}
