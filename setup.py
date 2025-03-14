from setuptools import setup, find_packages

setup(
    name="stressapi",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        "typer>=0.9.0",
        "httpx>=0.25.0",
        "rich>=13.6.0",
        "pydantic>=2.4.2",
        "asyncio>=3.4.3",
        "aiohttp>=3.8.6",
    ],
    entry_points={
        "console_scripts": [
            "stressapi=stressapi.cli.main:app",
        ],
    },
)
