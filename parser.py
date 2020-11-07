from config import *

import pandas as pd
import argparse

def parse_args():
    parser = argparse.ArgumentParser("Parse cross_reference.txt format")

    parser.add_argument("--infile",
        nargs="?", const="cross_reference.txt", default="cross_references.txt")

    parser.add_argument("--in_sep",
        nargs="?", const="\t", default="\t")

    parser.add_argument("--outfile",
        nargs="?", const="out.csv", default="out.csv")

    return parser.parse_args()


def split_verse(series):
    split = series.str.split(pat=".", expand=True)
    book_raw, chapter, verse = split[0], split[1], split[2]

    book = book_raw.map(lambda book: books[book_abbreviations[book]])

    return book, chapter, verse


def main(args):
    refs = pd.read_csv(args.infile, sep=args.in_sep)

    to_verse_begin_end = refs[heading_to_verse].str.split(pat="-", expand=True)
    to_verse_begin, to_verse_end = to_verse_begin_end[0], to_verse_begin_end[1]
    to_verse_end = to_verse_end.mask(pd.isnull, to_verse_begin)

    from_verse_split = split_verse(refs[heading_from_verse])
    to_verse_begin_split = split_verse(to_verse_begin)
    to_verse_end_split = split_verse(to_verse_end)
    votes = refs[heading_votes]

    columns = [
        *from_verse_split,
        *to_verse_begin_split,
        *to_verse_end_split,
        votes
    ]

    out = pd.DataFrame(
        {heading: column for heading, column in zip(out_headings, columns)}
    )

    out.to_csv(args.outfile, index_label=out_heading_index)


if __name__ == '__main__':
    exit(main(parse_args()))
