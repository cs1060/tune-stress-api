import streamlit as st
import requests
import json
import pandas as pd
import time
import plotly.express as px
from datetime import datetime

# Configure page
st.set_page_config(
    page_title="StressAPI - Load Testing Tool",
    page_icon="🚀",
    layout="wide",
    initial_sidebar_state="expanded"
)

# API URL - Change this to your FastAPI server URL
API_URL = "http://localhost:8001"

# Initialize session state variables
if "authenticated" not in st.session_state:
    st.session_state.authenticated = False
if "token" not in st.session_state:
    st.session_state.token = None
if "username" not in st.session_state:
    st.session_state.username = None
if "current_page" not in st.session_state:
    st.session_state.current_page = "home"


# Authentication functions
def login(username, password):
    """Log in user and store token in session state."""
    try:
        response = requests.post(
            f"{API_URL}/token",
            data={"username": username, "password": password}
        )
        if response.status_code == 200:
            data = response.json()
            st.session_state.token = data["access_token"]
            st.session_state.authenticated = True
            st.session_state.username = username
            return True
        else:
            return False
    except requests.RequestException:
        return False


def register(username, email, password):
    """Register a new user."""
    try:
        response = requests.post(
            f"{API_URL}/register",
            json={"username": username, "email": email, "password": password}
        )
        if response.status_code == 200:
            return True, "Registration successful! Please log in."
        else:
            error_detail = response.json().get("detail", "Registration failed.")
            return False, error_detail
    except requests.RequestException:
        return False, "Could not connect to server."


def logout():
    """Log out user and clear session state."""
    st.session_state.authenticated = False
    st.session_state.token = None
    st.session_state.username = None
    st.session_state.current_page = "home"


def get_auth_header():
    """Get authorization header for authenticated requests."""
    return {"Authorization": f"Bearer {st.session_state.token}"}


# API functions
def get_stress_tests():
    """Get user's stress tests."""
    try:
        response = requests.get(
            f"{API_URL}/stress-tests", 
            headers=get_auth_header()
        )
        if response.status_code == 200:
            return response.json()
        return []
    except:
        return []


def create_stress_test(test_data):
    """Create a new stress test."""
    try:
        response = requests.post(
            f"{API_URL}/stress-tests",
            json=test_data,
            headers=get_auth_header()
        )
        if response.status_code == 200:
            return True, response.json()
        else:
            error_detail = response.json().get("detail", "Failed to create stress test.")
            return False, error_detail
    except requests.RequestException as e:
        return False, f"Could not connect to server: {str(e)}"


def run_stress_test(test_id):
    """Run a stress test and get results."""
    try:
        with st.spinner("Running stress test... This may take a moment."):
            response = requests.post(
                f"{API_URL}/stress-tests/{test_id}/run",
                headers=get_auth_header()
            )
            if response.status_code == 200:
                return True, response.json()
            else:
                error_detail = response.json().get("detail", "Failed to run stress test.")
                return False, error_detail
    except requests.RequestException as e:
        return False, f"Could not connect to server: {str(e)}"


def get_test_results(test_id):
    """Get test results for a specific stress test."""
    try:
        response = requests.get(
            f"{API_URL}/test-results/{test_id}",
            headers=get_auth_header()
        )
        if response.status_code == 200:
            return True, response.json()
        else:
            error_detail = response.json().get("detail", "Failed to get test results.")
            return False, error_detail
    except requests.RequestException as e:
        return False, f"Could not connect to server: {str(e)}"


# Navigation
def set_page(page):
    st.session_state.current_page = page


# UI Components
def render_landing_page():
    """Render the landing page with login/register form."""
    col1, col2 = st.columns([1, 1])
    
    with col1:
        st.image("https://raw.githubusercontent.com/tiangolo/fastapi/master/docs/en/docs/img/logo-margin/logo-teal.png", width=200)
        st.title("StressAPI")
        st.subheader("High-Performance Load Testing for FastAPI")
        st.markdown("""
        StressAPI is a powerful load testing tool built specifically for FastAPI applications.
        
        ### Features:
        
        - 🚀 **Simulate Real-World Traffic**: Test how your API handles concurrent requests
        - 📊 **Detailed Analytics**: Get insights on response times and performance
        - 🎯 **Targeted Testing**: Focus on specific endpoints that need optimization
        - ⚡ **High Performance**: Built on top of FastAPI's asynchronous capabilities
        - 🔄 **Continuous Testing**: Integrate with your CI/CD pipeline
        
        Get started by signing up or logging in!
        """)
    
    with col2:
        tab1, tab2 = st.tabs(["Login", "Register"])
        
        with tab1:
            st.subheader("Login")
            username = st.text_input("Username", key="login_username")
            password = st.text_input("Password", type="password", key="login_password")
            login_button = st.button("Login")
            
            if login_button:
                if username and password:
                    if login(username, password):
                        st.success("Login successful!")
                        st.rerun()
                    else:
                        st.error("Invalid username or password.")
                else:
                    st.warning("Please enter both username and password.")
        
        with tab2:
            st.subheader("Register")
            new_username = st.text_input("Username", key="register_username")
            new_email = st.text_input("Email", key="register_email")
            new_password = st.text_input("Password", type="password", key="register_password")
            confirm_password = st.text_input("Confirm Password", type="password", key="confirm_password")
            register_button = st.button("Register")
            
            if register_button:
                if new_username and new_email and new_password and confirm_password:
                    if new_password != confirm_password:
                        st.error("Passwords do not match.")
                    else:
                        success, message = register(new_username, new_email, new_password)
                        if success:
                            st.success(message)
                            time.sleep(1)
                            # Auto-login after registration
                            if login(new_username, new_password):
                                st.rerun()
                        else:
                            st.error(message)
                else:
                    st.warning("Please fill out all fields.")
                    
    # Footer
    st.markdown("---")
    st.markdown(" 2025 StressAPI. Built with FastAPI and Streamlit.")


def render_sidebar():
    """Render the sidebar navigation."""
    st.sidebar.title(f"Welcome, {st.session_state.username}!")
    
    # Navigation
    st.sidebar.header("Navigation")
    
    if st.sidebar.button("Dashboard", key="nav_dashboard"):
        set_page("dashboard")
    
    if st.sidebar.button("New Stress Test", key="nav_new_test"):
        set_page("new_test")
    
    if st.sidebar.button("View Tests", key="nav_view_tests"):
        set_page("view_tests")
    
    # Logout
    st.sidebar.markdown("---")
    if st.sidebar.button("Logout"):
        logout()
        st.rerun()


def render_dashboard():
    """Render the dashboard page."""
    st.title("Dashboard")
    st.subheader("Your Stress Test Overview")
    
    # Fetch stress tests
    stress_tests = get_stress_tests()
    
    if not stress_tests:
        st.info("You haven't created any stress tests yet. Create one to get started!")
        if st.button("Create Stress Test"):
            set_page("new_test")
            st.rerun()
        return
    
    # Display overview metrics
    col1, col2, col3 = st.columns(3)
    with col1:
        st.metric("Total Tests", len(stress_tests))
    
    with col2:
        recent_tests = [t for t in stress_tests if datetime.fromisoformat(t["created_at"].replace("Z", "+00:00")).date() == datetime.today().date()]
        st.metric("Tests Today", len(recent_tests))
    
    with col3:
        unique_endpoints = set(t["target_url"] for t in stress_tests)
        st.metric("Unique Endpoints", len(unique_endpoints))
    
    # Display recent tests
    st.subheader("Recent Tests")
    
    # Convert to DataFrame for display
    df = pd.DataFrame(stress_tests)
    df["created_at"] = pd.to_datetime(df["created_at"])
    df = df.sort_values("created_at", ascending=False).head(5)
    
    # Prepare data for display
    if not df.empty:
        display_df = df[["id", "title", "target_url", "request_method", "concurrent_users", "created_at"]]
        display_df.columns = ["ID", "Title", "Target URL", "Method", "Concurrent Users", "Created At"]
        display_df["Created At"] = display_df["Created At"].dt.strftime("%Y-%m-%d %H:%M")
        
        st.dataframe(display_df, use_container_width=True)
        
        # Select a test to run or view results
        test_id = st.selectbox("Select a test to run or view results:", df["id"].tolist(), format_func=lambda x: f"ID: {x} - {df[df['id'] == x]['title'].values[0]}")
        
        col1, col2 = st.columns(2)
        with col1:
            if st.button("Run Test", key=f"run_{test_id}"):
                success, result = run_stress_test(test_id)
                if success:
                    st.success("Stress test completed!")
                    st.json(result)
                else:
                    st.error(f"Failed to run stress test: {result}")
        
        with col2:
            if st.button("View Results", key=f"view_{test_id}"):
                success, results = get_test_results(test_id)
                if success and results:
                    st.subheader(f"Results for Test #{test_id}")
                    
                    # Convert to DataFrame
                    results_df = pd.DataFrame(results)
                    
                    # Create visualizations
                    if not results_df.empty:
                        # Response time chart
                        fig = px.bar(
                            results_df,
                            x="id",
                            y=["average_response_time_ms", "min_response_time_ms", "max_response_time_ms"],
                            title="Response Times (ms)",
                            labels={"value": "Time (ms)", "variable": "Metric"},
                            barmode="group"
                        )
                        st.plotly_chart(fig, use_container_width=True)
                        
                        # Success rate chart
                        for idx, row in results_df.iterrows():
                            success_rate = (row["successful_requests"] / row["total_requests"]) * 100 if row["total_requests"] > 0 else 0
                            st.metric(f"Test Run #{row['id']} Success Rate", f"{success_rate:.1f}%")
                            
                            col1, col2, col3 = st.columns(3)
                            col1.metric("Total Requests", row["total_requests"])
                            col2.metric("Successful", row["successful_requests"])
                            col3.metric("Failed", row["failed_requests"])
                    else:
                        st.info("No test results available.")
                elif success and not results:
                    st.info("No results available for this test.")
                else:
                    st.error(f"Failed to fetch test results: {results}")


def render_new_test_form():
    """Render form to create a new stress test."""
    st.title("Create a New Stress Test")
    
    with st.form("new_stress_test"):
        title = st.text_input("Test Title", placeholder="e.g., Homepage Load Test")
        
        target_url = st.text_input("Target URL", placeholder="https://api.example.com/endpoint")
        
        request_method = st.selectbox(
            "Request Method",
            options=["GET", "POST", "PUT", "DELETE"]
        )
        
        # Request headers and body (optional)
        st.subheader("Request Headers (Optional)")
        headers_json = st.text_area(
            "Headers (JSON format)",
            placeholder='{"Content-Type": "application/json", "Authorization": "Bearer token"}',
            height=100
        )
        
        st.subheader("Request Body (Optional)")
        st.info("Only applicable for POST and PUT requests")
        request_body = st.text_area(
            "Request Body",
            placeholder='{"key": "value"}',
            height=100,
            disabled=(request_method == "GET" or request_method == "DELETE")
        )
        
        # Test parameters
        st.subheader("Test Parameters")
        col1, col2 = st.columns(2)
        
        with col1:
            concurrent_users = st.slider(
                "Concurrent Users",
                min_value=1,
                max_value=100,
                value=10,
                help="Number of concurrent users simulated"
            )
        
        with col2:
            request_count = st.slider(
                "Total Requests",
                min_value=10,
                max_value=1000,
                value=100,
                step=10,
                help="Total number of requests to send"
            )
        
        submitted = st.form_submit_button("Create Stress Test")
        
        if submitted:
            # Validate form
            if not title or not target_url:
                st.error("Please provide a title and target URL.")
            else:
                # Prepare data
                test_data = {
                    "title": title,
                    "target_url": target_url,
                    "request_method": request_method,
                    "concurrent_users": concurrent_users,
                    "request_count": request_count
                }
                
                # Add optional fields if provided
                if headers_json:
                    try:
                        json.loads(headers_json)  # Validate JSON
                        test_data["request_headers"] = headers_json
                    except json.JSONDecodeError:
                        st.error("Invalid JSON format in headers.")
                        return
                
                if request_body and (request_method == "POST" or request_method == "PUT"):
                    test_data["request_body"] = request_body
                
                # Create the stress test
                success, result = create_stress_test(test_data)
                if success:
                    st.success("Stress test created successfully!")
                    # Navigate to view tests
                    st.session_state.current_page = "view_tests"
                    st.rerun()
                else:
                    st.error(f"Failed to create stress test: {result}")


def render_view_tests():
    """Render page to view all stress tests."""
    st.title("Your Stress Tests")
    
    # Fetch stress tests
    stress_tests = get_stress_tests()
    
    if not stress_tests:
        st.info("You haven't created any stress tests yet.")
        if st.button("Create Your First Test"):
            set_page("new_test")
            st.rerun()
        return
    
    # Convert to DataFrame for display
    df = pd.DataFrame(stress_tests)
    df["created_at"] = pd.to_datetime(df["created_at"])
    df = df.sort_values("created_at", ascending=False)
    
    # Filters
    st.subheader("Filter Tests")
    col1, col2 = st.columns(2)
    
    with col1:
        method_filter = st.multiselect(
            "Request Method",
            options=df["request_method"].unique().tolist(),
            default=df["request_method"].unique().tolist()
        )
    
    with col2:
        # Extract domains for filtering
        import urllib.parse
        df["domain"] = df["target_url"].apply(lambda url: urllib.parse.urlparse(url).netloc)
        domain_filter = st.multiselect(
            "Domain",
            options=df["domain"].unique().tolist(),
            default=df["domain"].unique().tolist()
        )
    
    # Apply filters
    filtered_df = df[
        df["request_method"].isin(method_filter) &
        df["domain"].isin(domain_filter)
    ]
    
    # Display filtered data
    if filtered_df.empty:
        st.warning("No tests match the selected filters.")
    else:
        st.subheader(f"Showing {len(filtered_df)} tests")
        
        # Prepare data for display
        display_df = filtered_df[["id", "title", "target_url", "request_method", "concurrent_users", "request_count", "created_at"]]
        display_df.columns = ["ID", "Title", "Target URL", "Method", "Concurrent Users", "Request Count", "Created At"]
        display_df["Created At"] = display_df["Created At"].dt.strftime("%Y-%m-%d %H:%M")
        
        st.dataframe(display_df, use_container_width=True)
        
        # Select a test to run
        test_id = st.selectbox(
            "Select a test to run:",
            filtered_df["id"].tolist(),
            format_func=lambda x: f"ID: {x} - {filtered_df[filtered_df['id'] == x]['title'].values[0]}"
        )
        
        if st.button("Run Selected Test"):
            success, result = run_stress_test(test_id)
            if success:
                st.success("Stress test completed successfully!")
                
                # Display results
                st.subheader("Test Results")
                
                col1, col2, col3 = st.columns(3)
                col1.metric("Total Requests", result["total_requests"])
                col2.metric("Successful", result["successful_requests"])
                col3.metric("Failed", result["failed_requests"])
                
                col1, col2, col3 = st.columns(3)
                col1.metric("Avg Response Time", f"{result['average_response_time_ms']} ms")
                col2.metric("Min Response Time", f"{result['min_response_time_ms']} ms")
                col3.metric("Max Response Time", f"{result['max_response_time_ms']} ms")
                
                # Calculate success rate
                success_rate = (result["successful_requests"] / result["total_requests"]) * 100 if result["total_requests"] > 0 else 0
                
                # Create simple chart
                chart_data = pd.DataFrame({
                    "Metric": ["Avg Response", "Min Response", "Max Response"],
                    "Time (ms)": [result["average_response_time_ms"], result["min_response_time_ms"], result["max_response_time_ms"]]
                })
                
                st.bar_chart(chart_data, x="Metric", y="Time (ms)")
                
                st.progress(success_rate / 100)
                st.write(f"Success Rate: {success_rate:.1f}%")
            else:
                st.error(f"Failed to run stress test: {result}")


# Main App
def main():
    # Check server availability
    try:
        health_check = requests.get(f"{API_URL}/health")
        server_available = health_check.status_code == 200
    except:
        server_available = False
    
    if not server_available:
        st.error(" FastAPI server is not available. Make sure it's running at " + API_URL)
        st.info("Start the server with: `uvicorn main:app --reload`")
        return
    
    # Authentication flow
    if not st.session_state.authenticated:
        render_landing_page()
    else:
        render_sidebar()
        
        # Page routing
        if st.session_state.current_page == "dashboard":
            render_dashboard()
        elif st.session_state.current_page == "new_test":
            render_new_test_form()
        elif st.session_state.current_page == "view_tests":
            render_view_tests()
        else:  # Default to dashboard
            render_dashboard()


if __name__ == "__main__":
    main()
