#!/bin/bash

# 批量生成2025年度商业·经管类书籍文章
# 基于豆瓣2025年度读书榜单，包含完整作者/译者/审校信息
export DASHSCOPE_API_KEY='sk-13ad9694361946fea468eec02d4938ca'
echo $DASHSCOPE_API_KEY;
echo "开始批量生成商业经管类书籍文章..."
echo "======================================"

# 1. 《源代码》
# python3 ../generate_post.py \
#     --topic book \
#     --title "源代码" \
#     --author "[美]比尔·盖茨 / 译者：鲁伊 译，郑纬民、韦青 审校" \
#     --goal "商业底层：探寻商业逻辑与核心竞争力的源代码" \
#     --prompt book_reading \
#     --force

# # 2. 《大道》
# python3 ../generate_post.py \
#     --topic book \
#     --title "大道" \
#     --author "赵理亚 选，芒格书院 编" \
#     --goal "商业认知：建立长期主义的商业大道与底层逻辑" \
#     --prompt book_reading \
#     --force

# # 3. 《因为独特》
# python3 ../generate_post.py \
#     --topic book \
#     --title "因为独特" \
#     --author "李翔" \
#     --goal "商业差异化：打造不可替代的独特商业价值与核心壁垒" \
#     --prompt book_reading \
#     --force

# # 4. 《真需求》
# python3 ../generate_post.py \
#     --topic book \
#     --title "真需求" \
#     --author "梁宁" \
#     --goal "商业洞察：穿透伪需求迷雾，精准捕捉用户核心真需求" \
#     --prompt book_reading \
#     --force

# 5. 《我从达尔文那里学到的投资知识》
python3 ../generate_post.py \
    --topic book \
    --title "我从达尔文那里学到的投资知识" \
    --author "[印]普拉克·普拉萨德 / 译者：彭相珍" \
    --goal "投资思维：借鉴达尔文进化论，建立长期稳健的投资逻辑" \
    --prompt book_reading \
    --force

# 6. 《如何快速了解一个行业》
python3 ../generate_post.py \
    --topic book \
    --title "如何快速了解一个行业" \
    --author "肖璟" \
    --goal "行业认知：掌握高效方法论，快速搭建行业核心认知框架" \
    --prompt book_reading \
    --force

# 7. 《国家为什么会破产》
python3 ../generate_post.py \
    --topic book \
    --title "国家为什么会破产" \
    --author "[美]瑞·达利欧 / 译者：[美]立雯" \
    --goal "宏观经济：解析国家破产的底层逻辑与经济风险警示" \
    --prompt book_reading \
    --force

# 8. 《英伟达之道》
python3 ../generate_post.py \
    --topic book \
    --title "英伟达之道" \
    --author "[美]金泰 / 译者：董世敏、周康林" \
    --goal "企业标杆：解码英伟达的商业成功之道与技术创新逻辑" \
    --prompt book_reading \
    --force

# 9. 《把脉：全球巨变与中国经济》
python3 ../generate_post.py \
    --topic book \
    --title "把脉：全球巨变与中国经济" \
    --author "高柏" \
    --goal "经济研判：把脉全球变局，洞察中国经济的机遇与挑战" \
    --prompt book_reading \
    --force

# 10. 《奥尔特曼传》
python3 ../generate_post.py \
    --topic book \
    --title "奥尔特曼传" \
    --author "周恒星" \
    --goal "人物启示：解码奥尔特曼的创业历程与AI时代的商业智慧" \
    --prompt book_reading \
    --force

echo "======================================"
echo "所有商业经管类书籍文章批量生成完成！"