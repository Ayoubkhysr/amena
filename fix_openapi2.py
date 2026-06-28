import re

file_path = r"e:\amena\backend\src\main\resources\openapi\openapi.yaml"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Add Dashboard tag
if "- name: Dashboard" not in content:
    content = content.replace("  - name: Offres\n    description: Category-based discount offer management operations\n", "  - name: Offres\n    description: Category-based discount offer management operations\n  - name: Dashboard\n    description: Dashboard analytics operations\n")

# Add Dashboard path
if "/api/dashboard/stats" not in content:
    content = content.replace("paths:\n", "paths:\n  /api/dashboard/stats:\n    get:\n      tags:\n        - Dashboard\n      summary: Get dashboard statistics\n      operationId: getDashboardStats\n      responses:\n        \"200\":\n          description: Successful response\n          content:\n            application/json:\n              schema:\n                $ref: \"#/components/schemas/DashboardStatsResponse\"\n\n")

schemas = """
    DashboardStatsResponse:
      type: object
      required:
        - totalSales
        - ordersToday
        - newClients
        - lowStockCount
      properties:
        totalSales:
          type: number
          format: double
        ordersToday:
          type: integer
        newClients:
          type: integer
        lowStockCount:
          type: integer

    ProductPage:
      type: object
      properties:
        content:
          type: array
          items:
            $ref: "#/components/schemas/ProductResponse"
        totalElements:
          type: integer
          format: int64
        totalPages:
          type: integer
        size:
          type: integer
        number:
          type: integer
        first:
          type: boolean
        last:
          type: boolean
        empty:
          type: boolean

    OrderPage:
      type: object
      properties:
        content:
          type: array
          items:
            $ref: "#/components/schemas/OrderResponse"
        totalElements:
          type: integer
          format: int64
        totalPages:
          type: integer
        size:
          type: integer
        number:
          type: integer
        first:
          type: boolean
        last:
          type: boolean
        empty:
          type: boolean
"""

if "DashboardStatsResponse:" not in content:
    # Append safely to schemas
    content = content.replace("  schemas:\n", "  schemas:\n" + schemas)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
