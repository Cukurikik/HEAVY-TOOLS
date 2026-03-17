import json
import sys

def validate_report(filepath):
    try:
        with open(filepath, 'r') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error loading JSON: {e}")
        return False

    if not isinstance(data, list):
        print("Root must be an array")
        return False

    required_fields = ["title", "description", "deepLink", "filePath", "lineNumber", "confidence", "rationale", "context", "language", "category", "estimatedImpact"]
    allowed_categories = ["dead-code", "todo-fixme", "duplication", "deprecated", "complexity", "unused-import", "other"]

    for i, item in enumerate(data):
        for field in required_fields:
            if field not in item:
                print(f"Item {i} missing field: {field}")
                return False

        if not isinstance(item['confidence'], int) or item['confidence'] not in [1, 2, 3]:
            print(f"Item {i} invalid confidence: {item['confidence']}")
            return False

        if item['category'] not in allowed_categories:
            print(f"Item {i} invalid category: {item['category']}")
            return False

    print("Validation passed!")
    return True

if __name__ == "__main__":
    if len(sys.argv) > 1:
        validate_report(sys.argv[1])
    else:
        print("Please provide a filepath.")
