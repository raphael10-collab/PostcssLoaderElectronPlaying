import * as React from 'react'

export default function Ghost() {

  React.useEffect(() => {


    return () => { // clean-up function
    }
  }, [])

  return (
    <div className='container'>
      <h1 className='heading'>
          Ghost
      </h1>


    </div>
  );

}
