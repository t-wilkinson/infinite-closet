#!/usr/bin/env python
"""I forget what this is supposed to do. Shouldn't be necessary anymore though.
"""
import re
import unicodedata
import argparse
import csv
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

