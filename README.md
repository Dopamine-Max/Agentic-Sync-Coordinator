<div align="center">

# <span style="color:#cad8d9">Agentic Sync Coordinator</span>

## 📝 Note

THIS PROJECT IS CURRENTLY PAUSED AND NOT SET FOR DEPLOYMENT. For now, the Backend (FastAPI) and Frontend (Vite) are to be run locally. In the planned cloud deployment, Google authentication will be handled through the frontend, which will issue Bearer tokens to the MCP server for authorization, replacing the temporary /ping-based login trigger.

## 🎨 Frontend

Built with **React** through **Vite** for a modern, fast development experience. The frontend uses **Axios** to communicate with the backend API endpoints, providing a responsive chat interface for interacting with Google Workspace tools through natural language.

**Key Features:**
- Real-time chat interface with message history
- Axios-based API integration for backend communication
- Vite for lightning-fast builds and hot module replacement
- **Tailwind CSS** for utility-first styling and responsive design

## 🔌 Backend Endpoints

<table width="100%">
<tr>
<td width="33%" valign="top">

### `GET /query`
**Process natural language queries**

Accepts user questions and automatically invokes Google Workspace tools (Gmail, Calendar, Drive, Tasks, Contacts) via the MCP server. Maintains conversation history and returns both the AI response and metadata about which tools were called.

**Parameters:**
- `q` (required): The natural language query

**Returns:**
- `response_text`: AI-generated response
- `function_calls`: List of tools invoked with their parameters

</td>
<td width="33%" valign="top">

### `GET /ping`
**Health check endpoint**

Used to start authentication flow on the frontend with google login.

**Returns:**
- `status`: "success"
- `message`: Connection confirmation

</td>
<td width="33%" valign="top">

### `POST /reset`
**Clear conversation history**

Resets the message buffer to start a fresh conversation.

**Returns:**
- `status`: "success"
- `message`: Confirmation of cleared messages

</td>
</tr>
</table>


# <span style="color:#cad8d9">MCP Server Details</span>

<table>
<tr><td width="50%" valign="top">

**Required**
| Variable | Purpose |
|----------|---------|
| `GOOGLE_OAUTH_CLIENT_ID` | OAuth client ID from Google Cloud |
| `GOOGLE_OAUTH_CLIENT_SECRET` | OAuth client secret |
| `MCP_ENABLE_OAUTH21` | Set to `true` for OAuth 2.1 support |
| `WORKSPACE_EXTERNAL_URL` | External URL for reverse proxy setups |

</td></tr>
</table>

## 🧰 Available Tools

<table width="100%">
<tr>
<td width="50%" valign="top">

### 📅 **Google Calendar** <sub>[`calendar_tools.py`](gcalendar/calendar_tools.py)</sub>

| Tool | Description |
|------|-------------|
| `list_calendars` | List accessible calendars |
| `get_events` | Retrieve events with time range filtering |
| `create_event` | Create events with attachments & reminders |
| `modify_event` | Update existing events |
| `delete_event` | Remove events |

</td>
<td width="50%" valign="top">

### 📁 **Google Drive** <sub>[`drive_tools.py`](gdrive/drive_tools.py)</sub>

| Tool | Description |
|------|-------------|
| `search_drive_files` | Search files with query syntax |
| `get_drive_file_content` | Read file content (Office formats) |
| `list_drive_items` | List folder contents |
| `create_drive_file` | Create files or fetch from URLs |

</td>
</tr>
<tr>

<tr>
<td width="50%" valign="top">

### 📧 **Gmail** <sub>[`gmail_tools.py`](gmail/gmail_tools.py)</sub>

| Tool | Description |
|------|-------------|
| `search_gmail_messages` | Search with Gmail operators |
| `get_gmail_message_content` | Retrieve message content |
| `get_gmail_messages_content_batch` | Batch retrieve message content |
| `send_gmail_message` | Send emails |
| `get_gmail_thread_content` | Get full thread content |
| `modify_gmail_message_labels` | Modify message labels |
| `list_gmail_labels` | List available labels |
| `manage_gmail_label` | Create/update/delete labels |
| `draft_gmail_message` | Create drafts |
| `get_gmail_threads_content_batch` | Batch retrieve thread content |
| `batch_modify_gmail_message_labels` | Batch modify labels |
| `start_google_auth` | Initialize authentication |

</td>
<td width="50%" valign="top">

### ✓ **Google Tasks** <sub>[`tasks_tools.py`](gtasks/tasks_tools.py)</sub>

| Tool | Description |
|------|-------------|
| `list_tasks` | List tasks with filtering |
| `get_task` | Retrieve task details |
| `create_task` | Create tasks with hierarchy |
| `update_task` | Modify task properties |
| `delete_task` | Remove tasks |
| `move_task` | Reposition tasks |
| `clear_completed_tasks` | Hide completed tasks |
| `*_task_list` | List/get/create/update/delete task lists |

</td>
</tr>
<tr>

<tr>
<td width="50%" valign="top">

### 👤 **Google Contacts** <sub>[`contact_tools.py`](gcontacts/contact_tools.py)</sub>

| Tool | Description |
|------|-------------|
| `search_contacts` | Search contacts by name or email |
| `create_contact` | Create contacts with email &/or phone |
| `update_contact_email` | Add email to existing contact |

</td>
</tr>
</table>