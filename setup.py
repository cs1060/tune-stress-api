from setuptools import setup, find_packages

setup(
    name="api-tester",
    version="0.1.0",
    packages=find_packages(where="backend"),
    package_dir={"": "backend"},
    python_requires=">=3.9",
    install_requires=[
        "fastapi>=0.68.0",
        "httpx>=0.24.0",
        "pydantic>=1.8.0",
        "faker>=8.0.0",
        "python-dateutil>=2.8.2",
        "uvicorn>=0.15.0",
        "aiohttp>=3.8.0",
        "cachetools>=5.0.0"
    ],
)
