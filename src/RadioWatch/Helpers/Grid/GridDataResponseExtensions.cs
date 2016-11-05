using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace RadioWatch.Helpers.Grid
{
    public static class GridDataResponseExtensions
    {
        public static List<T> ApplyPaging<T>(this IQueryable<T> query, int page, int pageSize)
        {
            return query.Skip(page*pageSize).Take(pageSize).ToList();
        }

        public static IQueryable<T> ApplySorting<T>(this IQueryable<T> query, string sort, int by)
        {
            if (!string.IsNullOrWhiteSpace(sort))
            {
                var props = typeof(T).GetProperties();
                var sortBy = props.FirstOrDefault(x => x.Name == sort.FirstOrDefault().ToString().ToUpper() + String.Join("", sort.Skip(1)));
                if (sortBy != null)
                {
                    return by == -1 ? query.OrderByDescending(x => sortBy.GetValue(x)) : by == 1 ? query.OrderBy(x => sortBy.GetValue(x)) : query;
                }
            }
            return query;
        }
    }
}