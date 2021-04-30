import React from 'react'

export const useAnalytics = () => {
  const [analytics, setAnalytics] = React.useState<any>()

  React.useEffect(() => {
    setAnalytics((window as any).firebase.analytics())
  }, [])

  return analytics
}
export default useAnalytics
