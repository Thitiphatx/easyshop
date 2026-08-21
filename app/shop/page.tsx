"use server"
import React from 'react'
import ServerSection from './components/ServerSection'
import { getSession } from '../actions/session'
import Loading from '@/components/Loading'

const Manage: React.FC = async () => {
  const session = await getSession()

  if (!session) {
    return <Loading />
  }

  return <ServerSection session={session} />
}

export default Manage