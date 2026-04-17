# TASK16: Integration - WebSocket

## Status: PENDING

## Description
Connect frontend-backend WebSocket

## Endpoints
- WebSocket handshake at `/ws`
- Events: `alert`, `accept`, `decline`, `location_update`, `eta_update`

## Frontend Hook
- `useWebSocket()` hook for real-time communication

## Backend Handler
- `hub.go` - WebSocket hub for broadcasting

## Verification
- Alert pushes to donor in real-time
- Donor response updates hospital dashboard

## Progress
- [ ]