import kagglehub

# Download latest version
path = kagglehub.dataset_download("")
print("Path to dataset files:", path)