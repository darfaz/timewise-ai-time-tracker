# API Integration Documentation

## Overview

The TimeWise/BillExact frontend integrates with a Python backend using a robust API client layer built with Axios, React Query, and TypeScript.

## Architecture

### Core Components

1. **API Client** (`src/lib/api.ts`)
   - Axios-based HTTP client
   - Automatic request/response interceptors
   - Error handling with user-friendly toasts
   - Configurable base URL from Settings

2. **Type Definitions** (`src/lib/apiTypes.ts`)
   - Zod schemas for runtime validation
   - TypeScript interfaces for type safety
   - Consistent data models matching backend

3. **React Query Hooks** (`src/hooks/useApi.ts`)
   - Custom hooks for all endpoints
   - Automatic caching and revalidation
   - Optimistic updates
   - Loading and error states

4. **Mock API Service** (`src/lib/mockApiService.ts`)
   - LocalStorage-based fallback
   - Development without backend
   - Automatic mode switching

5. **WebSocket Support** (`src/hooks/useWebSocket.ts`)
   - Real-time activity updates
   - Auto-reconnection logic
   - Toast notifications

## Configuration

### Backend URL

Set the backend URL in **Settings** page:
- Development: `http://localhost:3000/api`
- Production: Your deployed backend URL

The app automatically switches between mock mode (localhost) and live mode.

### Connection Status

A status indicator in the header shows:
- 🟢 **Connected** - Backend is reachable
- 🔴 **Disconnected** - Backend unavailable
- 🔵 **Mock Mode** - Using local mock data

## API Endpoints

### Health & Status

```typescript
GET /api/health
// Returns: { status: string, timestamp: string, version?: string }

GET /api/aw/status
// Returns: { connected: boolean, lastSync?: Date, buckets?: string[] }
```

### Activities

```typescript
GET /api/aw/activities?date=YYYY-MM-DD
GET /api/aw/activities?start=ISO&end=ISO
// Returns: Activity[]

POST /api/activities/sync
// Triggers manual ActivityWatch sync
// Returns: { success: boolean, count: number }
```

### Time Entries

```typescript
GET /api/entries
GET /api/entries/:id
POST /api/entries
PUT /api/entries/:id
DELETE /api/entries/:id
POST /api/entries/:id/split
```

### Categories (General Mode)

```typescript
GET /api/categories
POST /api/categories
PUT /api/categories/:id
DELETE /api/categories/:id
```

### Matters (Legal Mode)

```typescript
GET /api/matters
GET /api/matters/:id
POST /api/matters
PUT /api/matters/:id
```

### Clients (Legal Mode)

```typescript
GET /api/clients
POST /api/clients
PUT /api/clients/:id
```

### Compliance (Legal Mode)

```typescript
POST /api/compliance/check
// Body: { entries: BillingEntry[] }
// Returns: ComplianceCheckResponse

POST /api/compliance/fix-batch
// Body: { entries: BillingEntry[] }
// Returns: { fixed: BillingEntry[] }
```

### LEDES Export (Legal Mode)

```typescript
POST /api/ledes/generate
// Body: { entries: BillingEntry[], format: "LEDES" | "CSV" }
// Returns: { filename: string, data: string }

GET /api/ledes/history
// Returns: ExportHistory[]
```

## Usage Examples

### Using Hooks in Components

```typescript
import { useActivities, useSyncActivities } from '@/hooks/useApi';

function ActivityTimeline() {
  const { data: activities, isLoading, error } = useActivities({ 
    date: '2024-03-15' 
  });
  const syncMutation = useSyncActivities();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading activities</div>;

  return (
    <div>
      <button onClick={() => syncMutation.mutate()}>
        Sync Activities
      </button>
      {activities?.map(activity => (
        <div key={activity.id}>{activity.appName}</div>
      ))}
    </div>
  );
}
```

### Creating/Updating Data

```typescript
import { useCreateMatter, useUpdateMatter } from '@/hooks/useApi';

function MatterForm() {
  const createMatter = useCreateMatter();
  const updateMatter = useUpdateMatter();

  const handleSubmit = (data) => {
    if (isEditing) {
      updateMatter.mutate({ id: matter.id, matter: data });
    } else {
      createMatter.mutate(data);
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### Real-time Updates

```typescript
import { useActivityWebSocket } from '@/hooks/useWebSocket';

function Dashboard() {
  const { isConnected } = useActivityWebSocket(true);

  // Automatically receives toast notifications when new activities
  // are captured and refetches activity data

  return <div>WebSocket: {isConnected ? 'Connected' : 'Disconnected'}</div>;
}
```

## Error Handling

The API client handles errors at multiple levels:

1. **Network Errors** - Shows toast with retry option
2. **401 Unauthorized** - Future: redirect to login
3. **400 Bad Request** - Displays validation errors
4. **500 Server Error** - User-friendly error message

All errors are logged to console for debugging.

## Authentication

Currently the API client supports Bearer token authentication:

```typescript
localStorage.setItem('auth_token', 'your-token-here');
```

The token is automatically added to all requests in the `Authorization` header.

## Mock Mode

When backend URL is `localhost` or not configured:
- Uses `mockApiService` for data operations
- Data stored in localStorage
- Mimics backend behavior for development
- Seamless switch to real backend

## WebSocket Events

Real-time updates via WebSocket (`/ws/activities`):

```typescript
{
  type: 'activity',
  data: { appName, windowTitle, ... }
}

{
  type: 'sync_complete',
  data: { count: 15 }
}

{
  type: 'error',
  data: { message: 'Error description' }
}
```

## Development Tips

1. **Test without Backend**: Start in mock mode, then configure backend URL
2. **Monitor Connection**: Check status indicator in header
3. **Check Network Tab**: All API calls visible in browser DevTools
4. **Error Toasts**: Failed requests show notifications automatically
5. **React Query DevTools**: Enable for query debugging (optional)

## Production Deployment

1. Configure production backend URL in Settings
2. Ensure CORS is configured on backend
3. Use HTTPS for WebSocket connections (wss://)
4. Set appropriate timeouts for slow networks
5. Implement retry logic for critical operations

## TypeScript Types

All API responses are typed using Zod schemas:

```typescript
import { Activity, Matter, Client } from '@/lib/apiTypes';

// Runtime validation
const validated = ActivitySchema.parse(data);

// Type-safe usage
const activity: Activity = validated;
```

## Future Enhancements

- [ ] Authentication system
- [ ] File upload support
- [ ] Offline mode with sync queue
- [ ] Request/response logging
- [ ] API rate limiting
- [ ] Batch operations
- [ ] GraphQL support (optional)
