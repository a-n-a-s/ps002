# TASK15: Hospital Portal - Blood Bank Intelligence

## Status: PENDING

## Description
Build blood bank intelligence panel

## Screens
### Screen 7: Blood Bank Intelligence Panel
- Table: blood groups × banks × units × expiry
- Red highlight: expiring soon
- Smart suggestion: "3 units B- expiring in 6hrs at City Bank — dispatch now"
- Cross-hospital redistribution:
  - "Apollo: +6 O+ surplus | KIMS: -4 O+ shortage"
  - "Initiate Transfer Request" button
- Smart Supply Chain: network diagram of optimal blood flow

## Components
- `BloodBankPanel.tsx`
- `InventoryTable.tsx`
- `ExpiringAlert.tsx`
- `RedistributionPanel.tsx`
- `SupplyChainDiagram.tsx`

## Progress
- [ ]