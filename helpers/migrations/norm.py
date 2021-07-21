#!/usr/bin/env python
import re
import os
import sys
import unicodedata
import json
import argparse
import csv
from collections import defaultdict
import pprint
pp = pprint.PrettyPrinter(indent=1, compact=True)


def slugify(value):
    value = unicodedata.normalize('NFKD', value).encode(
        'ascii', 'ignore').decode('ascii')
    value = re.sub(r'[^./\w\s-]', '', value.lower())

    # split by `.` and normalize each portion
    parts = []
    for ext in value.split('.'):
        ext = re.sub(r'[-\.\s]+', '-', ext).strip('-_')
        if ext:
            parts.append(ext)
    return '.'.join(parts)


def norm(line):
    lines = re.sub(r'\|', '\n', line.rstrip('\n')).split('\n')
    return map(lambda x: x.strip(), lines)


parser = argparse.ArgumentParser()
parser.add_argument('--read', action='store_true')
parser.add_argument('--filters', '-f')
parser.add_argument('--link', '-l', action='store_true')
args = parser.parse_args()

# (colors, occasions, styles, weather, categories)
filter_names = ["colors", "occasions", "styles", "weather", "categories"]
filter_name_ids = {
    "colors": "color_id",
    "occasions": "occasion_id",
    "styles": "style_id",
    "weather": "weather_id",
    "categories": "category_id",
}

# v4
if args.read:
    with open('prod.products.csv', newline='\n') as f:
        reader = list(csv.DictReader(f))
        for filter_name in filter_names:
            build = set()
            product_inserts = []
            filter_inserts = []
            for row in reader:
                for name in norm(row[filter_name]):
                    slug = slugify(name)
                    if name == '' or slug == '':
                        continue
                    if slug not in build:
                        build.add(slug)
                        filter_inserts.append(
                            f"({len(build)}, '{slug}', '{name}')")
                product_inserts.append(f"({len(build)}, {row['id']})")
            print(
                f'INSERT INTO {filter_name} (id, slug, name) VALUES {", ".join(filter_inserts)};')
            print(
                f'INSERT INTO products__{filter_name} ({filter_name_ids[filter_name]}, product_id) VALUES {", ".join(product_inserts)};')

# v3
# if args.read:
#     with open('prod.products.csv', newline='\n') as f:
#         # we want to iterate over multiple times
#         reader = list(csv.DictReader(f))
#         for filter_name in filter_names:
#             build = defaultdict(dict)
#
#             for row in reader:
#                 for name in norm(row[filter_name]):
#                     slug = slugify(name)
#                     if name == '' or slug == '':
#                         continue
#                     if slug not in build:
#                         build[slug] = (re.sub(f"'", "''", name), [])
#                     build[slug][1].append(row['id'])
#
#             product_inserts = []
#             filter_inserts = []
#             # sort for consistent order
#             for i, slug in enumerate(sorted(build.keys())):
#                 (name, product_ids) = build[slug]
#                 filter_inserts.append(f"({i+1}, '{slug}', '{name}')")
#                 for product_id in product_ids:
#                     product_inserts.append(f"({i+1}, {product_id})")
#
#             print(
#                 f'INSERT INTO {filter_name} (id, slug, name) VALUES {", ".join(filter_inserts)};')
#             print(
#                 f'INSERT INTO products__{filter_name} ({filter_name_ids[filter_name]}, product_id) VALUES {", ".join(product_inserts)};')

# v2
# if args.read:
#    build_filters = defaultdict(dict)
#    build_links = defaultdict(dict)
#
#    with open('prod.products.csv', newline='\n') as f:
#        reader = csv.DictReader(f)
#        for row in reader:
#            for filter_name in filter_names:
#                for name in norm(row[filter_name]):
#                    slug = slugify(name)
#                    if slug not in build_links[filter_name]:
#                        build_links[filter_name][slug] = []
#
#                    if name != '' and slug != '':
#                        build_filters[filter_name][slug] = (
#                            re.sub(f"'", "''", name), row['id'])
#                        build_links[filter_name][slug].append(row['id'])
#
#    filter_name_ids = {
#        "colors": "color_id",
#        "occasions": "occasion_id",
#        "styles": "style_id",
#        "weather": "weather_id",
#        "categories": "category_id",
#    }
#
#    ordered_slugs = defaultdict(list)
#    for filter_name, slugs in build_filters.items():
#        for slug in slugs.keys():
#            ordered_slugs[filter_name].append(slug)
#        ordered_slugs[filter_name].sort()
#
#    for filter_name, ordered_slug in ordered_slugs.items():
#        inserts = []
#        for i, slug in enumerate(ordered_slug):
#            (name, _) = build_filters[filter_name][slug]
#            inserts.append(f"({i+1}, '{slug}', '{name}')")
#        print(
#            f'INSERT INTO {filter_name} (id, slug, name) VALUES {", ".join(inserts)};')
#
#    for filter_name, ordered_slug in ordered_slugs.items():
#        inserts = []
#        for i, slug in enumerate(ordered_slug):
#            product_ids = build_links[filter_name][slug]
#            for product_id in product_ids:
#                inserts.append(f"({i+1}, {product_id})")
#        print(
#            f'INSERT INTO products__{filter_name} ({filter_name_ids[filter_name]}, product_id) VALUES {", ".join(inserts)};')
#

# v1
# if args.filters:
#     inserts = {}
#     os.chdir(args.filters)
#
#     for file in os.listdir():
#         with open(file, 'r') as f:
#             for i, line in enumerate(f):
#                 print(line)
#                 for line in norm(line):
#                     line = re.sub(r"'", r"''", line.strip(' \n'))
#                     if not line:
#                         continue
#                     elif re.match('-+', line):  # remove ---------- header
#                         continue
#                     elif re.match(r'\(\d+ rows\)', line):  # remove (<n> rows) footer
#                         continue
#                     else:  # we found the filter
#                         inserts[normalize(line)] = line
#
#     # print(inserts)
#     filter_name = os.path.splitext(file)[0]
#     inserts = [f"({i}, '{line}', '{normalized}')"
#                for i, (normalized, line)
#                in enumerate(inserts.items())]
#     print(f'DELTE FROM {filter_name}')
#     print(
#         f'INSERT INTO {filter_name} (id, name, slug) VALUES {", ".join(inserts)};')
#     print()
#
# if args.link == True:
#     #    0        1        2       3        4
#     # (colors, occasions, styles, weather, categories)
#     filter_names = ["colors", "occasions", "styles", "weather", "categories"]
#     filter_name_ids = {
#         "colors": "color_id",
#         "occasions": "occasion_id",
#         "styles": "style_id",
#         "weather": "weather_id",
#         "categories": "category_id",
#     }
#
#     inserts = {k: [] for k in filter_names}
#
#     with open('filters.json', 'r') as f:
#         ids = json.load(f)
#     with open('products.db', 'r') as f:
#         raw_lines = f.read().split('\n')
#
#     for raw_line in raw_lines[1:]:  # skip header
#         fields = raw_line.split('|')
#         try:
#             product_id = ids['products'][normalize(fields[0])]
#             print(product_id)
#         except:
#             continue
#
#         for i, field in enumerate(fields[1:]):
#             filter_name = filter_names[i]
#
#             for value in field.split('%'):
#                 normalized = normalize(value)
#                 if re.search(r'^\s+$', value):
#                     continue
#                 field_id = ids[filter_name][normalized]
#                 inserts[filter_name].append(f"({product_id}, {field_id})")
#
#     print(
#         f'INSERT INTO products__{filter_name} (product_id, {filter_name_ids[filter_name]}) VALUES {", ".join(inserts[filter_name])};')
