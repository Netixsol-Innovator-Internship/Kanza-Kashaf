// components/SocketListener.tsx
'use client'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { connectSocket, disconnectSocket, socket } from '../../lib/socket'
import toast from 'react-hot-toast'
import { api } from '../../store/api'

export default function SocketListener() {
  const dispatch = useDispatch()

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token) return

    // Connect the socket with token
    connectSocket(token)

    // ---- Event handlers ----
    const onAuctionStarted = (data: any) => {
      toast(`Auction started`)
      // refresh auctions list
      dispatch(api.util.invalidateTags([{ type: 'Auctions', id: 'LIST' }]))
    }

    const onNewBid = (data: any) => {
      // data expected: { auctionId, amount, userId }
      const auctionId = data?.auctionId || data?.auctionId?.toString?.()
      const amount = data?.amount
      toast.success(`New bid: $${amount}`)
      if (auctionId) {
        dispatch(api.util.invalidateTags([
          { type: 'Auction', id: auctionId },
          { type: 'Auctions', id: 'LIST' },
        ]))
        // Also refresh bids list for that auction
        dispatch(api.util.invalidateTags([{ type: 'Bids', id: auctionId }]))
      } else {
        dispatch(api.util.invalidateTags([{ type: 'Auctions', id: 'LIST' }]))
      }
    }

    const onAuctionEnded = (data: any) => {
      const auctionId = data?.auctionId
      toast(`Auction ended`)
      dispatch(api.util.invalidateTags([
        { type: 'Auction', id: auctionId },
        { type: 'Auctions', id: 'LIST' },
      ]))
    }

    const onAuctionWon = (data: any) => {
      const auctionId = data?.auctionId
      toast.success(`Auction won!`)
      dispatch(api.util.invalidateTags([
        { type: 'Auction', id: auctionId },
        { type: 'Auctions', id: 'LIST' },
        { type: 'User', id: 'ME' },
      ]))
    }

    const onWishlistUpdated = (data: any) => {
      // payload: { auctionId, added: boolean }
      toast(`Wishlist updated`)
      // refresh profile (so components relying on getProfile update)
      dispatch(api.util.invalidateTags([{ type: 'User', id: 'ME' }]))
    }

    // wire server events
    socket.on('auction_started', onAuctionStarted)
    socket.on('new_bid', onNewBid)
    socket.on('auction_ended', onAuctionEnded)
    socket.on('auction_won', onAuctionWon)
    socket.on('wishlist_updated', onWishlistUpdated)
    socket.on('auction_update', (payload) => {
      // fallback generic update
      dispatch(api.util.invalidateTags([{ type: 'Auctions', id: 'LIST' }]))
    })

    // cleanup
    return () => {
      socket.off('auction_started', onAuctionStarted)
      socket.off('new_bid', onNewBid)
      socket.off('auction_ended', onAuctionEnded)
      socket.off('auction_won', onAuctionWon)
      socket.off('wishlist_updated', onWishlistUpdated)
      socket.off('auction_update')
      disconnectSocket()
    }
  }, [dispatch])

  return null
}
